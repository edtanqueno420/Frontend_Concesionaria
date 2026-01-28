import logo from '../assets/yec-logo.png';

type Props = {
  className?: string;
};

export const YECLogo = ({ className = '' }: Props) => {
  return (
    <img
      src={logo}
      alt="YEC Concesionaria"
      className={className}
    />
  );
};
