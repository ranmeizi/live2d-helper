import React, { useEffect, useRef} from "react";
import ModelHelper from "live2d-helper";

export default function Live2d() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const l2dRef = useRef<ModelHelper>()

  useEffect(() => {
    // 初始化
  }, []);

  function init() {
    if (!canvasRef.current) {
      return;
    }
    const l2d = new ModelHelper({
      resourcePath: "/models/",
      workerPath: "/l2d.worker.js",
    });
    l2d.initialize(canvasRef.current);

    l2dRef.current=l2d
  }

  function changeModel(name:string){
    if(!l2dRef.current){
      return 
    }
    l2dRef.current.loadModel(name);
  }

  return (
    <div>
      <button onClick={init}>初始化</button>
      <div>
        <div>加载模型</div>
        <div>
          <button onClick={()=>changeModel('草神')}>草神</button>
          <button onClick={()=>changeModel('草神1')}>草神1</button>
        </div>
      </div>
      <div>
        <canvas ref={canvasRef} height="800" width="800"></canvas>
      </div>
    </div>
  );
}
