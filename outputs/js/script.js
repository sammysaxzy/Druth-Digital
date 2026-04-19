(function () {
    if (typeof document === "undefined") {
        return;
    }

    const script = document.createElement("script");
    script.src = "../../js/script.js";
    document.head.appendChild(script);
}());
