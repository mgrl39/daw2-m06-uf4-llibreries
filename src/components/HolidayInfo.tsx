import { HolidayInfo as HolidayInfoType } from "../types/IpInfo";

interface HolidayInfoProps {
  holidays: HolidayInfoType[];
  country: string;
  isVisible: boolean;
}

const HolidayInfo = ({ holidays, country, isVisible }: HolidayInfoProps) => {
  if (!isVisible || holidays.length === 0) return null;

  return (
    <div className="holiday-container">
      <div className="holiday-header">
        <h5>🎉 Festivos en {country}</h5>
        <span className="holiday-subtitle">
          {new Date() > new Date(holidays[0].date)
            ? "Festivos más recientes de "
            : "Próximos festivos de "}
          {new Date().getFullYear()}
        </span>
      </div>

      <ul className="holiday-list">
        {holidays.map((holiday, index) => {
          // Formatear fecha para mostrar
          const holidayDate = new Date(holiday.date);
          const formattedDate = holidayDate.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
          });

          return (
            <li key={index} className="holiday-item">
              <div className="holiday-date">{formattedDate}</div>
              <div className="holiday-name">{holiday.localName}</div>
              {holiday.localName !== holiday.name && (
                <div className="holiday-intl-name">{holiday.name}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HolidayInfo;
