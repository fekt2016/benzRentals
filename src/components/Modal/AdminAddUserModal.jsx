/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
import styled from "styled-components";
import {

  FaTimes,
} from "react-icons/fa";
import {
  
  Select,
  FormField,
  Input,
} from "../../components/forms/Form";
import {
  PrimaryButton,
 
  GhostButton,
} from "../../components/ui/Button";
import { LuxuryCard } from "../../components/Cards/Card";
import { useCreateUser  } from "../../hooks/useUser";


function AdminAddUserModal({setShowModal}) {
const { mutate: createUser, isPending: isCreating } = useCreateUser(); 

    const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "User",
  });


    const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
    createUser(formData, {
      onSuccess: () => {
        setShowModal(false);
      },
      onError: (err) => {
        console.log(err)
      },
    });
  };

   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
    return (
        
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Add New User</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormField>
                  <label>Full Name</label>
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField>
                  <label>Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    // value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField>
                  <label>Phone Number</label>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField>
                  <label>Password</label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField>
                  <label>Role</label>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    options={[
                      { value: "user", label: "Customer" },
                      { value: "admin", label: "Admin" },
                    ]}
                  />
                </FormField>
              </FormGroup>

              <ModalActions>
                <GhostButton type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </GhostButton>
                <PrimaryButton type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create User"}
                </PrimaryButton>
              </ModalActions>
            </form>
          </ModalContent>
        </ModalOverlay>
      
    )
}

export default AdminAddUserModal



/* ---------- MODAL ---------- */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled(LuxuryCard)`
  width: 100%;
  max-width: 520px;
  background: var(--white);
  padding: var(--space-xl);
  border-radius: var(--radius-2xl);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
`;

const ModalTitle = styled.h2`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: var(--text-xl);
  cursor: pointer;

  &:hover {
    color: var(--error);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-lg);
`;