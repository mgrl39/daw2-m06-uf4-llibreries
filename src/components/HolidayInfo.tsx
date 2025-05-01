import { HolidayInfo as HolidayInfoType } from "../types/IpInfo";

interface HolidayInfoProps {
  holidays: HolidayInfoType[];
  country: string;
  isVisible: boolean;
}

/**
 * Component per mostrar els dies festius d'un país
 */
const HolidayInfo = ({ holidays, country, isVisible }: HolidayInfoProps) => {
  if (!isVisible || holidays.length === 0) return null;

  return (
    <div
      className="position-absolute bottom-0 end-0 m-3 bg-black border border-secondary rounded shadow text-white"
      style={{ width: "280px", maxHeight: "350px", zIndex: 1000 }}
    >
      <div className="p-3 border-bottom border-secondary">
        <h6 className="mb-1 fw-bold">Dies festius: {country}</h6>
        <small className="text-secondary">
          {new Date() > new Date(holidays[0].date) ? "Recents" : "Propers"} (
          {new Date().getFullYear()})
        </small>
      </div>

      <ul className="list-unstyled m-0">
        {holidays.map((holiday, index) => {
          const dataFestiu = new Date(holiday.date);
          const dataFormatada = dataFestiu.toLocaleDateString("ca-ES", {
            day: "numeric",
            month: "long",
          });

          return (
            <li key={index} className="p-2 border-bottom border-secondary">
              <div className="fw-bold text-primary small">{dataFormatada}</div>
              <div className="mt-1">{holiday.localName}</div>
              {holiday.localName !== holiday.name && (
                <div className="small text-secondary">{holiday.name}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HolidayInfo;
