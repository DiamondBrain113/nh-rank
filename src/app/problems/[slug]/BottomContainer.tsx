import React, { useRef, useState } from "react";

import { PlainEditor } from "@/app/problems/[slug]/CodeEditor";
import { ProblemType } from "@/types/problem";

import "./style.css";

interface Props {
  problem: ProblemType;
}

export default function BottomContainer({ problem }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const [panelState, setPanelState] = useState<
    "stdout" | "stderr" | "compile" | "message" | "testcase"
  >("stdout");

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (
      !isDragging.current ||
      !containerRef.current ||
      !leftRef.current ||
      !rightRef.current
    )
      return;

    const containerWidth = containerRef.current.offsetWidth;
    const newLeftWidth =
      e.clientX - containerRef.current.getBoundingClientRect().left;

    leftRef.current.style.width = `${newLeftWidth}px`;
    rightRef.current.style.width = `${containerWidth - newLeftWidth - 2}px`;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  return (
    <div
      className="w-full h-full flex bottom-container max-[995px]:flex-col max-[995px]:h-auto"
      ref={containerRef}
    >
      <div
        className="stdin-container w-[50%] h-full flex flex-col max-[995px]:w-full "
        ref={leftRef}
      >
        <div className="flex w-full h-8 bg-ebony-clay border-b border-solid border-gray-700">
          <TabItem title="STDIN" active={true} onClick={() => {}} />
        </div>
        <PlainEditor value={problem.testcases[0].input} editable={true} />
      </div>
      <div
        className="bottom-drag-width h-full w-1.5 bg-gray-700 cursor-col-resize flex items-center justify-center overflow-hidden resize-line"
        ref={dragRef}
        onMouseDown={handleMouseDown}
      >
        <div className="h-10 w-[1.6px] rounded-lg bg-gray-400"></div>
      </div>
      <div
        className="others-container w-[50%] h-full flex flex-col max-[995px]:w-full max-[995px]:h-[250px]"
        ref={rightRef}
      >
        <div className="flex w-full h-8 bg-ebony-clay border-b border-solid border-gray-700 overflow-y-hidden overflow-x-auto">
          <TabItem
            title="STDOUT"
            active={panelState === "stdout"}
            onClick={() => setPanelState("stdout")}
          />
          <TabItem
            title="STDERR"
            active={panelState === "stderr"}
            onClick={() => {
              setPanelState("stderr");
            }}
          />
          <TabItem
            title="COMPILE"
            active={panelState === "compile"}
            onClick={() => {
              setPanelState("compile");
            }}
          />
          <TabItem
            title="MESSAGE"
            active={panelState === "message"}
            onClick={() => {
              setPanelState("message");
            }}
          />
          <TabItem
            title="TESTCASE"
            active={panelState === "testcase"}
            onClick={() => {
              setPanelState("testcase");
            }}
          />
        </div>
        {(panelState === "stdout" && <PlainEditor />) ||
          (panelState === "stderr" && <PlainEditor />) ||
          (panelState === "compile" && <PlainEditor />) ||
          (panelState === "message" && <PlainEditor />) || <div>a</div>}
      </div>
    </div>
  );
}

const TabItem = ({
  title,
  active,
  onClick,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`w-[100] py-1 px-4 flex items-center justify-center border-solid border-dodger-blue  uppercase text-sm font-bold cursor-pointer transition-colors duration-200 ${
        active ? "bg-steel-gray text-white border-t-3" : "text-gray-500"
      }`}
      onClick={onClick}
    >
      {title}
    </div>
  );
};
