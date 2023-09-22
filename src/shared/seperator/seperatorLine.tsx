interface IBorder {
  className?: string;
}

const SeperatorLine = (props: IBorder) => {
  return (
    <span
      className={`border-[0.5px] w-full h-0 border-gray-900 mt-2 ${props.className}`}
    />
  );
};
export default SeperatorLine;
