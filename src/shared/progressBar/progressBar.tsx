interface IProgress {
  color?: string;
  value: number;
}

const ProgressBar = (props: IProgress) => {
  return (
    <div className="flex-start flex h-1.5 w-full overflow-hidden rounded-sm bg-gray-800 font-sans text-xs font-medium">
      <div
        className={`flex h-full items-baseline justify-center overflow-hidden break-all ${props.color}  w-[${props.value}%]`}
      ></div>
    </div>
  );
};

export default ProgressBar;
