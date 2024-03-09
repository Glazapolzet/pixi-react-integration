import { Application, Graphics, Sprite } from "pixi.js";
import { useEffect, useRef } from "react";

const PixiApp = () => {
  const ref = useRef(null);

  async function run(app: Application) {
    await app.init({
      autoStart: true,
      width: 500,
      height: 500,
      antialias: true,
    });

    for (let i = 0; i < 10; i++) {
      createNode(
        Math.floor(Math.random() * app.screen.width),
        Math.floor(Math.random() * app.screen.height),
        15,
        0xffffff,
      );
    }

    function createNode(x, y, radius, color) {
      const gfx = new Graphics();

      gfx.circle(x, y, radius);
      gfx.fill(color);

      const circleTexture = app.renderer.generateTexture(gfx);
      const node = new Sprite(circleTexture);

      node.eventMode = "static";
      node.cursor = "pointer";
      node.anchor.set(0.5);
      node.on("pointerdown", onDragStart, node);

      // Move the sprite to its designated position
      node.x = x;
      node.y = y;

      // Add it to the stage
      app.stage.addChild(node);
    }

    let dragTarget = null;

    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;
    app.stage.on("pointerup", onDragEnd);
    app.stage.on("pointerupoutside", onDragEnd);

    function onDragMove(event) {
      if (dragTarget) {
        dragTarget.parent.toLocal(event.global, null, dragTarget.position);
      }
    }

    function onDragStart() {
      // Store a reference to the data
      // * The reason for this is because of multitouch *
      // * We want to track the movement of this particular touch *
      this.alpha = 0.5;
      dragTarget = this;
      app.stage.on("pointermove", onDragMove);
    }

    function onDragEnd() {
      if (dragTarget) {
        app.stage.off("pointermove", onDragMove);
        dragTarget.alpha = 1;
        dragTarget = null;
      }
    }

    ref.current.appendChild(app.canvas);
  }

  async function destroyApp(app: Application) {
    // console.log(app);
    await app.destroy(true, true);
  }

  useEffect(() => {
    const app = new Application();

    // Start the PixiJS app
    run(app).catch((err) => console.log(err));

    return () => {
      // On unload completely destroy the application and all of it's children
      destroyApp(app).catch((err) => console.log(err));
    };
  }, []);

  return <div ref={ref} />;
};

export default PixiApp;
