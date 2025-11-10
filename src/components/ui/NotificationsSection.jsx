/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import styled from "styled-components";
import {SectionCard, SectionHeader, SectionTitle, SectionContent} from "../ui/SectionCard";
import { Checkbox  } from "../forms/Form";

import { FaBell } from "react-icons/fa";
 const  NotificationsSection = ({ preferences, onChange }) => (
  <SectionCard>
    <SectionHeader>
      <SectionTitle>
        <FaBell />
        Notification Preferences
      </SectionTitle>
    </SectionHeader>

    <SectionContent>
      <NotificationGroup>

          <Checkbox
          label="Booking Confirmations"
            type="checkbox"
            checked={preferences.notifications.bookingConfirmations}
            onChange={(e) =>
              onChange(
                "notifications",
                "bookingConfirmations",
                e.target.checked
              )
            }
          />
      
          <Checkbox
          label="Rental Reminders"
            type="checkbox"
            checked={preferences.notifications.rentalReminders}
            onChange={(e) =>
              onChange("notifications", "rentalReminders", e.target.checked)
            }
          />
       
          <Checkbox
          label="Special Offers & Promotions"
            type="checkbox"
            checked={preferences.notifications.specialOffers}
            onChange={(e) =>
              onChange("notifications", "specialOffers", e.target.checked)
            }
          />
        
          <Checkbox
          label="SMS Alerts"
            type="checkbox"
            checked={preferences.notifications.smsAlerts}
            onChange={(e) =>
              onChange("notifications", "smsAlerts", e.target.checked)
            }
          />
       
      </NotificationGroup>
    </SectionContent>
  </SectionCard>
);

export default NotificationsSection;


const NotificationGroup = styled.div`
display: flex;
flex-direction: column;
gap: var(--space-md);
padding: var(--space-md);
margin-bottom: var(--space-lg);
`;
