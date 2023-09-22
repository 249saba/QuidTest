interface IBorder {
  className?: string;
}

const SeperatorDashed = (props: IBorder) => {
  return <span className={`dashed-border-v mt-2 ${props.className}`} />;
};
export default SeperatorDashed;
