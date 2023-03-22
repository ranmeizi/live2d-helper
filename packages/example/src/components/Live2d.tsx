import React, { useEffect, useRef } from "react";
import ModelHelper from "live2d-helper";

export default function Live2d() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 初始化
  }, []);

  function init() {
    if (!canvasRef.current) {
      return;
    }
    const l2d = new ModelHelper("l2d.worker.js");
    l2d.initialize(canvasRef.current);
  }

  return (
    <div>
      <button onClick={init}>初始化</button>
      <canvas ref={canvasRef} height="800" width="800"></canvas>
    </div>
  );
}
