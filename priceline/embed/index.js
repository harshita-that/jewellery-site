(function () {
  var PRICELINE_API = "https://your-domain.vercel.app";

  function getOrCreateSession() {
    var key = "pl_session";
    var existing = localStorage.getItem(key);
    if (existing) return existing;
    var id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, id);
    return id;
  }

  function track(workspaceId, experimentId, variantId, eventType, metadata) {
    var sessionId = getOrCreateSession();
    fetch(PRICELINE_API + "/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId: workspaceId,
        experimentId: experimentId,
        variantId: variantId,
        sessionId: sessionId,
        eventType: eventType,
        metadata: metadata || {},
      }),
    }).catch(function () {});
  }

  function renderTier(tier, workspaceId, experimentId, variantId) {
    var card = document.createElement("div");
    card.style.cssText =
      "border:1px solid " +
      (tier.highlighted ? "#fff" : "rgba(255,255,255,0.15)") +
      ";border-radius:12px;padding:24px;background:" +
      (tier.highlighted ? "rgba(255,255,255,0.05)" : "#000") +
      ";color:#fff;font-family:system-ui,sans-serif;";

    var name = document.createElement("p");
    name.style.cssText = "font-weight:600;font-size:14px;margin:0 0 8px";
    name.textContent = tier.name;

    var price = document.createElement("p");
    price.style.cssText = "font-size:28px;font-weight:700;margin:0 0 4px";
    price.innerHTML =
      "$" + tier.price + '<span style="font-size:13px;font-weight:400;opacity:0.4">/' + tier.period + "</span>";

    var desc = document.createElement("p");
    desc.style.cssText = "font-size:12px;opacity:0.4;margin:0 0 16px";
    desc.textContent = tier.description;

    var ul = document.createElement("ul");
    ul.style.cssText = "list-style:none;padding:0;margin:0 0 20px;";
    tier.features.forEach(function (f) {
      var li = document.createElement("li");
      li.style.cssText = "font-size:12px;opacity:0.6;margin-bottom:6px;";
      li.textContent = "✓ " + f;
      ul.appendChild(li);
    });

    var btn = document.createElement("button");
    btn.style.cssText =
      "width:100%;padding:10px;border-radius:8px;border:none;cursor:pointer;font-size:13px;font-weight:500;" +
      (tier.highlighted ? "background:#fff;color:#000;" : "background:rgba(255,255,255,0.1);color:#fff;");
    btn.textContent = tier.ctaText;
    btn.addEventListener("mouseover", function () {
      track(workspaceId, experimentId, variantId, "tier_hover", { tier: tier.name });
    });
    btn.addEventListener("click", function () {
      track(workspaceId, experimentId, variantId, "cta_click", { tier: tier.name });
    });

    card.appendChild(name);
    card.appendChild(price);
    card.appendChild(desc);
    card.appendChild(ul);
    card.appendChild(btn);
    return card;
  }

  function renderPricing(container, config, workspaceId, experimentId, variantId) {
    container.style.cssText = "background:#000;padding:48px 24px;font-family:system-ui,sans-serif;";

    var headline = document.createElement("h2");
    headline.style.cssText = "color:#fff;text-align:center;font-size:24px;font-weight:600;margin:0 0 8px";
    headline.textContent = config.headline;

    var sub = document.createElement("p");
    sub.style.cssText = "color:rgba(255,255,255,0.4);text-align:center;font-size:14px;margin:0 0 40px";
    sub.textContent = config.subheadline;

    var grid = document.createElement("div");
    var cols = Math.min(config.tiers.length, 3);
    grid.style.cssText =
      "display:grid;grid-template-columns:repeat(" + cols + ",1fr);gap:16px;max-width:900px;margin:0 auto;";

    config.tiers.forEach(function (tier) {
      grid.appendChild(renderTier(tier, workspaceId, experimentId, variantId));
    });

    container.appendChild(headline);
    container.appendChild(sub);
    container.appendChild(grid);

    track(workspaceId, experimentId, variantId, "page_view", {});
  }

  function init() {
    var scripts = document.querySelectorAll("script[data-priceline]");
    scripts.forEach(function (script) {
      var experimentId = script.getAttribute("data-experiment");
      var workspaceId = script.getAttribute("data-workspace");
      var containerId = script.getAttribute("data-container");

      if (!experimentId || !workspaceId || !containerId) return;

      fetch(PRICELINE_API + "/api/embed?experimentId=" + experimentId + "&workspaceId=" + workspaceId)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var container = document.getElementById(containerId);
          if (!container || !data.variant) return;
          renderPricing(container, data.variant.config, workspaceId, experimentId, data.variant.id);
        })
        .catch(function () {});
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();