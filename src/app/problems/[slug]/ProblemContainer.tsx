import { PointImage, RankImage } from "@/assets/images";
import { OProblem, Rank } from "@/models/Problem";
import Image from "next/image";

interface Props {
  problem: OProblem;
}

export default function ProblemContainer({ problem }: Props) {
  return (
    <div className="w-full h-full flex flex-col px-4 overflow-x-hidden overflow-y-auto pb-4 max-[995px]:h-auto">
      <div className="min-h-16 flex items-center gap-4 font-bold text-sm">
        <div className="flex gap-1 items-center">
          <Image src={RankImage} alt="rank" width={20} />
          <span>{problem ? Rank[problem.rank] : "Đang tải..."}</span>
        </div>
        <div className="flex gap-1 items-center">
          <Image src={PointImage} alt="point" width={20} />
          <span>{problem ? problem.point : "Đang tải..."}</span>
        </div>
      </div>
      <div className="gap-y-6 flex flex-col">
        <div className="flex flex-col gap-y-4">
          <h1 className="font-bold text-dodger-blue uppercase text-xl">
            {problem ? problem.title : "Đang tải..."}
          </h1>
          <p className="whitespace-pre-line">
            {problem ? problem.description : "Đang tải..."}
          </p>
        </div>
        <div className="flex flex-col gap-y-4">
          <h1 className="font-bold text-dodger-blue text-xl">Mô tả đầu vào</h1>
          <p className="whitespace-pre-line">
            {problem ? problem.example.input : "Đang tải..."}
          </p>
        </div>
        <div className="flex flex-col gap-y-4">
          <h1 className="font-bold text-dodger-blue text-xl">Mô tả đầu ra</h1>
          <p className="whitespace-pre-line">
            {problem ? problem.example.input : "Đang tải..."}
          </p>
        </div>
        <div className="flex flex-col gap-y-4">
          <h1 className="font-bold text-dodger-blue text-xl">Testcase mẫu</h1>
          <div className="flex flex-col gap-y-2 w-full h-fit">
            <h2 className="text-[16px] font-semibold text-white">
              Đầu vào mẫu 1
            </h2>
            <pre className="w-full p-4 rounded-lg bg-steel-gray">
              {problem ? problem.testcases[0].input : "Đang tải..."}
            </pre>
          </div>
          <div className="flex flex-col gap-y-2 w-full h-fit">
            <h2 className="text-[16px] font-semibold text-white">
              Đầu ra mẫu 1
            </h2>
            <pre className="w-full p-4 rounded-lg bg-steel-gray">
              {problem ? problem.testcases[0].output : "Đang tải..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
