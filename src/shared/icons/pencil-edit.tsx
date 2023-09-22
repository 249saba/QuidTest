import LazyImage from "../lazyImage";
import PencilIcon from "@assets/images/icons/pencil.png";

const PencilEditIcon = (props: any) => {
  return <LazyImage src={PencilIcon} className={props.className} />;
};

export default PencilEditIcon;
