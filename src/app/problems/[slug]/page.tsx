"use client";

import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
import { BiHome } from "react-icons/bi";

import Navbar from "@/components/home/Navbar";
import EditorContainer from "@/app/problems/[slug]/EditorContainer";
import SidebarContainer from "@/app/problems/[slug]/SidebarContainer";
import { OProblem } from "@/models/Problem";
import { OSubmission } from "@/models/Submission";

export default function Problem({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [problem, setProblem] = useState<OProblem | null>(null);
  const [submissions, setSubmissions] = useState<OSubmission[] | null>(null);

  useEffect(() => {
    async function getProblem() {
      const res = await fetch(`/api/problems/${slug}`, {
        method: "GET",
      });
      await res.json().then((data) => {
        setProblem(data.problem);
      });
    }
    getProblem();
  }, []);

  useEffect(() => {
    if (!problem) return;
    const getSubmissions = async () => {
      if (submissions) return;
      const res = await fetch(`/api/submissions?problemId=${problem?._id}`, {
        method: "GET",
      });
      await res.json().then((data) => {
        setSubmissions(data.submissions);
      });
    };
    getSubmissions();
  }, [problem]);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

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

    leftRef.current.style.setProperty("--width", `${newLeftWidth}px`);
    rightRef.current.style.setProperty(
      "--width",
      `${containerWidth - newLeftWidth - 2}px`
    );
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="h-screen w-full flex flex-col pt-10 overflow-hidden max-[995px]:h-auto">
      <Navbar collapse={true} />

      <div className="h-10 w-full bg-ebony-clay flex gap-x-1 items-center py-2 px-4 border-b border-solid border-gray-700">
        <span>
          <BiHome />
        </span>
        /
        <Link
          href={`/topics/${problem?.topic._id}`}
          className="hover:text-dodger-blue transition-colors duration-300"
        >
          {problem ? problem.topic.name : "Đang tải..."}
        </Link>
        /
        <span className="font-bold uppercase">
          {problem ? problem.title : "Đang tải..."}
        </span>
      </div>
      <div
        className="w-full h-full overflow-hidden flex relative select-none max-[995px]:flex-col max-[995px]:h-auto max-[995px]:overflow-auto"
        ref={containerRef}
      >
        <SidebarContainer
          ref={leftRef}
          problem={problem!}
          submissions={submissions!}
        />
        <div
          className="h-full w-1.5 bg-gray-700 cursor-col-resize flex items-center justify-center overflow-hidden resize-line"
          ref={dragRef}
          onMouseDown={handleMouseDown}
        >
          <div className="h-10 w-[1.6px] rounded-lg bg-gray-400"></div>
        </div>
        <EditorContainer
          ref={rightRef}
          problem={problem!}
          submissions={submissions!}
        />
      </div>
    </div>
  );
}
