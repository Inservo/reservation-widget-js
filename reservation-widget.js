(function () {
  class InstaBookModule {
    constructor() {
      this.defaultHeight = 750;
      this.defaultWidth = 512;
      this.minWidth = 849;
      this.minHeight = 649;
    }

    async init() {
      await this.loadFancyBox();
      this.loadCSS();
      this.setupFancyBox();
    }

    async loadFancyBox() {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js";
        script.onload = () => {
          // Load CSS after script loads
          this.loadCSS();
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    loadCSS() {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css";
      document.head.appendChild(link);
    }

    getModuleHeight() {
      const moduleElement = document.getElementById("reservo-widget");
      return moduleElement?.dataset.moduleHeight
        ? parseInt(moduleElement.dataset.moduleHeight, 10)
        : this.defaultHeight;
    }

    getModuleWidth() {
      const moduleElement = document.getElementById("reservo-widget");
      return moduleElement?.dataset.moduleWidth
        ? Math.max(
            parseInt(moduleElement.dataset.moduleWidth, 10),
            this.defaultWidth
          )
        : this.defaultWidth;
    }

    setupFancyBox() {
      Fancybox.bind("[data-fancybox]", {
        showClass: "custom-css", // This will add the custom-css class
      });

      this.injectCustomStyles();
      this.setupModuleLinks();
    }

    injectCustomStyles() {
      const style = document.createElement("style");
      style.textContent = `
        /* Custom class applied when Fancybox is shown */

        .fancybox__container {
          background-color: transparent !important;
          padding: 0 !important;
        }

        .fancybox__content {
          // box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          // border-radius: 15px !important;

          background: transparent !important;

          padding: 0 !important;
        }

        .fancybox__backdrop {
          display: none !important;
          background: transparent !important;
        }

        body.fancybox-active {
          overflow: auto !important;
        }

        /* Mobile responsive styles */
        @media screen and (max-width: 768px) {
          .fancybox__content {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            transform: none !important;
            margin: 0 !important;
          }
        }

        .is-close-btn {
          display: none;
        }
      `;
      document.head.appendChild(style);
    }

    setupModuleLinks() {
      const links = {
        "#reservo-widget": {
          width: this.getModuleWidth(),
          height: this.getModuleHeight(),
        },
        "#reservation-widget": {
          width: this.getModuleWidth(),
          height: this.getModuleHeight(),
        },
        "#tol_menus": { width: 645, height: 500 },
        "#tol_carte": { width: 500, height: 420 },
        "#tol_newsletter": { width: 360, height: 350 },
      };

      let isOpen = false; // Add this line

      Object.entries(links).forEach(([selector, dimensions]) => {
        const element = document.querySelector(selector);
        if (element) {
          element.addEventListener("click", (e) => {
            if (isOpen) {
              // Add this check
              e.preventDefault();
              return;
            }
            if (
              window.innerWidth < this.minWidth ||
              window.innerHeight < this.minHeight
            ) {
              // Don't prevent default behavior, let the link open in a new tab
              window.open(element.href, "_blank");
            } else {
              e.preventDefault(); // Prevent default only for FancyBox
              isOpen = true; // Set isOpen to true
              Fancybox.show(
                [
                  {
                    src: element.href,
                    type: "iframe",
                    width: dimensions.width,
                    height: dimensions.height,
                  },
                ],
                {
                  on: {
                    destroy: () => {
                      isOpen = false; // Reset isOpen when FancyBox is closed
                    },
                  },
                }
              );
            }
          });
        }
      });
    }
  }

  // Initialize the module
  function initInstaBook() {
    const pixelRatio = window.devicePixelRatio || 1;
    if (window.innerWidth / pixelRatio > 641) {
      const instaBook = new InstaBookModule();
      instaBook.init().catch(console.error);
    }
  }

  // Run initialization when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInstaBook);
  } else {
    initInstaBook();
  }
})();
