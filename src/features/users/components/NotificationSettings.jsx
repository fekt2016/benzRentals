import React from "react";
import styled from "styled-components";
import { FiBell } from "react-icons/fi";
import {
  SettingsSection,
  SectionHeader,
  SettingItem,
  SettingLabel,
  ToggleSwitch,
} from "../SettingsPage.styles";

const NotificationSettings = ({ settings, onToggle, isLoading = false }) => {
  return (
    <SettingsSection>
      <SectionHeader>
        <FiBell size={20} />
        <h2>Notifications</h2>
      </SectionHeader>

      <SettingItem>
        <SettingLabel>
          <h3>Email Notifications</h3>
          <p>Receive email updates about your bookings and account</p>
        </SettingLabel>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={settings.emailNotifications || false}
            onChange={() => onToggle("emailNotifications")}
            disabled={isLoading}
            aria-label="Toggle email notifications"
            aria-checked={settings.emailNotifications || false}
          />
          <span />
        </ToggleSwitch>
      </SettingItem>

      <SettingItem>
        <SettingLabel>
          <h3>SMS Notifications</h3>
          <p>Receive text message updates about your bookings</p>
        </SettingLabel>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={settings.smsNotifications || false}
            onChange={() => onToggle("smsNotifications")}
            disabled={isLoading}
            aria-label="Toggle SMS notifications"
            aria-checked={settings.smsNotifications || false}
          />
          <span />
        </ToggleSwitch>
      </SettingItem>

      <SettingItem>
        <SettingLabel>
          <h3>Booking Reminders</h3>
          <p>Get reminders before your rental pickup date</p>
        </SettingLabel>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={settings.bookingReminders || false}
            onChange={() => onToggle("bookingReminders")}
            disabled={isLoading}
            aria-label="Toggle booking reminders"
            aria-checked={settings.bookingReminders || false}
          />
          <span />
        </ToggleSwitch>
      </SettingItem>

      <SettingItem>
        <SettingLabel>
          <h3>Promotional Emails</h3>
          <p>Receive special offers and promotions</p>
        </SettingLabel>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={settings.promotionalEmails || false}
            onChange={() => onToggle("promotionalEmails")}
            disabled={isLoading}
            aria-label="Toggle promotional emails"
            aria-checked={settings.promotionalEmails || false}
          />
          <span />
        </ToggleSwitch>
      </SettingItem>

      <SettingItem>
        <SettingLabel>
          <h3>Marketing Emails</h3>
          <p>Receive marketing communications and newsletters</p>
        </SettingLabel>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={settings.marketingEmails || false}
            onChange={() => onToggle("marketingEmails")}
            disabled={isLoading}
            aria-label="Toggle marketing emails"
            aria-checked={settings.marketingEmails || false}
          />
          <span />
        </ToggleSwitch>
      </SettingItem>
    </SettingsSection>
  );
};

export default NotificationSettings;

