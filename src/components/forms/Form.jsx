// src/components/ui/Form.jsx
import styled from "styled-components";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaSearch, FaChevronDown, FaCheck } from "react-icons/fa";

// Input Component
export const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  required = false,
  ...props
}) => {
  return (
    <InputWrapper>
      <InputElement
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      />
    </InputWrapper>
  );
};

// SearchInput Component
export const SearchInput = ({
  placeholder = "Search...",
  value,
  onChange,
  icon = <FaSearch />,
  ...props
}) => {
  return (
    <SearchInputWrapper>
      <SearchIcon>{icon}</SearchIcon>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </SearchInputWrapper>
  );
};

// Select Component
export const Select = ({
  value,
  onChange,
  options = [],
  placeholder = "Select an option...",
  ...props
}) => {
  return (
    <SelectWrapper>
      <SelectElement value={value} onChange={onChange} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectElement>
      <SelectChevron>
        <FaChevronDown />
      </SelectChevron>
    </SelectWrapper>
  );
};

// RangeSlider Component
export const RangeSlider = ({
  min = 0,
  max = 100,
  value = [min, max],
  onChange,
  formatValue = (val) => val,
  step = 1,
  ...props
}) => {
  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value);
    if (newMin <= value[1]) {
      onChange([newMin, value[1]]);
    }
  };

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    if (newMax >= value[0]) {
      onChange([value[0], newMax]);
    }
  };

  return (
    <RangeSliderWrapper>
      <RangeValues>
        <RangeValue>{formatValue(value[0])}</RangeValue>
        <RangeValue>{formatValue(value[1])}</RangeValue>
      </RangeValues>
      <RangeInputs>
        <RangeTrack>
          <RangeProgress
            $min={((value[0] - min) / (max - min)) * 100}
            $max={((value[1] - min) / (max - min)) * 100}
          />
        </RangeTrack>
        <RangeInput
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={handleMinChange}
          step={step}
          $position="min"
          {...props}
        />
        <RangeInput
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={handleMaxChange}
          step={step}
          $position="max"
          {...props}
        />
      </RangeInputs>
    </RangeSliderWrapper>
  );
};

// Styled Components

// Input Wrapper
const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

// Base Input Styles
const InputElement = styled.input`
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-family: var(--font-body);
  font-weight: var(--font-normal);
  transition: all var(--transition-normal);
  position: relative;

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  }

  &:hover:not(:focus) {
    border-color: var(--gray-400);
  }

  &:disabled {
    background: var(--gray-100);
    color: var(--text-muted);
    cursor: not-allowed;
  }

  /* Specific styles for different input types */
  &[type="password"] {
    letter-spacing: 0.1em;
  }

  &[type="number"] {
    /* -moz-appearance: textfield; */

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &[type="date"],
  &[type="time"],
  &[type="datetime-local"] {
    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
      opacity: 0.6;
      transition: opacity var(--transition-normal);

      &:hover {
        opacity: 1;
      }
    }
  }
`;

// Search Input Styles
const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 280px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: var(--space-md);
  color: var(--text-muted);
  font-size: var(--text-base);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Select Styles
const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SelectElement = styled.select`
  width: 100%;
  padding: var(--space-md) var(--space-2xl) var(--space-md) var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-family: var(--font-body);
  font-weight: var(--font-normal);
  appearance: none;
  cursor: pointer;
  transition: all var(--transition-normal);

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  }

  &:hover:not(:focus) {
    border-color: var(--gray-400);
  }

  &:disabled {
    background: var(--gray-100);
    color: var(--text-muted);
    cursor: not-allowed;
  }

  option {
    padding: var(--space-sm);
    font-family: var(--font-body);
  }
`;

const SelectChevron = styled.div`
  position: absolute;
  right: var(--space-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: var(--text-sm);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Range Slider Styles
const RangeSliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
`;

const RangeValues = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RangeValue = styled.span`
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-body);
  background: var(--gray-100);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
`;

const RangeInputs = styled.div`
  position: relative;
  height: 24px;
  display: flex;
  align-items: center;
`;

const RangeTrack = styled.div`
  position: absolute;
  width: 100%;
  height: 4px;
  background: var(--gray-300);
  border-radius: var(--radius-full);
  z-index: 1;
`;

const RangeProgress = styled.div`
  position: absolute;
  height: 4px;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  left: ${(props) => props.$min}%;
  right: ${(props) => 100 - props.$max}%;
  z-index: 2;
  transition: all var(--transition-normal);
`;

const RangeInput = styled.input`
  position: absolute;
  width: 100%;
  height: 24px;
  margin: 0;
  background: transparent;
  appearance: none;
  pointer-events: none;
  z-index: 3;

  &::-webkit-slider-thumb {
    appearance: none;
    pointer-events: all;
    width: 20px;
    height: 20px;
    border-radius: var(--radius-full);
    background: var(--white);
    border: 2px solid var(--primary);
    cursor: pointer;
    box-shadow: var(--shadow-md);
    transition: all var(--transition-normal);

    &:hover {
      transform: scale(1.1);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-dark);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &::-moz-range-thumb {
    pointer-events: all;
    width: 20px;
    height: 20px;
    border-radius: var(--radius-full);
    background: var(--white);
    border: 2px solid var(--primary);
    cursor: pointer;
    box-shadow: var(--shadow-md);
    transition: all var(--transition-normal);

    &:hover {
      transform: scale(1.1);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-dark);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &::-webkit-slider-track {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    border: transparent;
  }

  &::-moz-range-track {
    background: transparent;
    border: transparent;
  }
`;

// Additional Form Components

// TextArea Component
export const TextArea = styled.textarea`
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-family: var(--font-body);
  font-weight: var(--font-normal);
  resize: vertical;
  min-height: 120px;
  transition: all var(--transition-normal);

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  }

  &:hover:not(:focus) {
    border-color: var(--gray-400);
  }

  &:disabled {
    background: var(--gray-100);
    color: var(--text-muted);
    cursor: not-allowed;
  }
`;

// Checkbox Component
export const Checkbox = ({ checked, onChange, label, ...props }) => {
  return (
    <CheckboxWrapper>
      <CheckboxInput
        type="checkbox"
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <CheckboxControl $checked={checked}>
        {checked && <FaCheck />}
      </CheckboxControl>
      {label && <CheckboxLabel>{label}</CheckboxLabel>}
    </CheckboxWrapper>
  );
};

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  font-family: var(--font-body);
`;

const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const CheckboxControl = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid
    ${(props) => (props.$checked ? "var(--primary)" : "var(--gray-400)")};
  border-radius: var(--radius-sm);
  background: ${(props) => (props.$checked ? "var(--primary)" : "transparent")};
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  transition: all var(--transition-normal);

  ${CheckboxWrapper}:hover & {
    border-color: var(--primary);
  }
`;

const CheckboxLabel = styled.span`
  font-size: var(--text-base);
  color: var(--text-primary);
  font-weight: var(--font-normal);
`;

// Radio Button Component
export const Radio = ({ checked, onChange, label, name, value, ...props }) => {
  return (
    <RadioWrapper>
      <RadioInput
        type="radio"
        checked={checked}
        onChange={onChange}
        name={name}
        value={value}
        {...props}
      />
      <RadioControl $checked={checked} />
      {label && <RadioLabel>{label}</RadioLabel>}
    </RadioWrapper>
  );
};

const RadioWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  font-family: var(--font-body);
`;

const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const RadioControl = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid
    ${(props) => (props.$checked ? "var(--primary)" : "var(--gray-400)")};
  border-radius: var(--radius-full);
  background: ${(props) => (props.$checked ? "var(--primary)" : "transparent")};
  position: relative;
  transition: all var(--transition-normal);

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    background: var(--white);
    opacity: ${(props) => (props.$checked ? 1 : 0)};
    transition: opacity var(--transition-normal);
  }

  ${RadioWrapper}:hover & {
    border-color: var(--primary);
  }
`;

const RadioLabel = styled.span`
  font-size: var(--text-base);
  color: var(--text-primary);
  font-weight: var(--font-normal);
`;

// Form Group Component
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
`;

// Label Component
export const Label = styled.label`
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// Error Message Component
export const ErrorMessage = styled.span`
  font-size: var(--text-sm);
  color: var(--error);
  font-family: var(--font-body);
  font-weight: var(--font-medium);
`;

// Success Message Component
export const SuccessMessage = styled.span`
  font-size: var(--text-sm);
  color: var(--success);
  font-family: var(--font-body);
  font-weight: var(--font-medium);
`;

// File Input Component
export const FileInput = ({ onChange, accept, multiple = false, ...props }) => {
  return (
    <FileInputWrapper>
      <FileInputElement
        type="file"
        onChange={onChange}
        accept={accept}
        multiple={multiple}
        {...props}
      />
      <FileInputLabel>
        <FileInputIcon>📁</FileInputIcon>
        <FileInputText>Choose file{multiple ? "s" : ""}</FileInputText>
      </FileInputLabel>
    </FileInputWrapper>
  );
};

const FileInputWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const FileInputElement = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileInputLabel = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border: 2px dashed var(--gray-300);
  border-radius: var(--radius-lg);
  background: var(--white);
  color: var(--text-muted);
  font-family: var(--font-body);
  transition: all var(--transition-normal);
  text-align: center;
  justify-content: center;

  ${FileInputWrapper}:hover & {
    border-color: var(--primary);
    color: var(--primary);
  }
`;

const FileInputIcon = styled.span`
  font-size: var(--text-lg);
`;

const FileInputText = styled.span`
  font-size: var(--text-base);
  font-weight: var(--font-medium);
`;

// Export all components
export default {
  Input,
  SearchInput,
  Select,
  RangeSlider,
  TextArea,
  Checkbox,
  Radio,
  FileInput,
  FormGroup,
  Label,
  ErrorMessage,
  SuccessMessage,
};
