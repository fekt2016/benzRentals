// src/pages/UserPage.jsx
import React, { useState } from "react";
import styled from "styled-components";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
    joined: "March 2023",
    avatar:
      "https://images.unsplash.com/photo-1603415526960-f7e0328d7a23?auto=format&fit=crop&w=300&q=80",
  };

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    password: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Settings:", form);
    alert("Settings updated successfully!");
  };

  return (
    <Wrapper>
      <Tabs>
        <Tab
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </Tab>
        <Tab
          active={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </Tab>
      </Tabs>

      <Content>
        {activeTab === "profile" ? (
          <ProfileSection>
            <h2>My Profile</h2>
            <Card>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Joined:</strong> {user.joined}
              </p>
            </Card>
          </ProfileSection>
        ) : (
          <SettingsSection>
            <h2>Account Settings</h2>
            <Form onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </label>

              <label>
                Phone
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </label>

              <Divider />

              <h3>Change Password</h3>
              <label>
                Current Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </label>

              <label>
                New Password
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                />
              </label>

              <SaveButton type="submit">Save Changes</SaveButton>
            </Form>
          </SettingsSection>
        )}
      </Content>
    </Wrapper>
  );
};

export default ProfilePage;

// -------------------- Styles --------------------
const Wrapper = styled.div`
  /* font-family: "Arial", sans-serif; */
  /* background: red; */
  /* min-height: 100vh; */
`;

// const Header = styled.section`
//   display: flex;
//   align-items: center;
//   gap: 2rem;
//   padding: 3rem 2rem;
//   background: #111;
//   color: white;
//   border-bottom: 1px solid #333;
//   flex-wrap: wrap;
//   text-align: center;

//   @media (max-width: 768px) {
//     flex-direction: column;
//     padding: 2rem 1rem;
//   }
// `;

// const Avatar = styled.img`
//   width: 120px;
//   height: 120px;
//   border-radius: 50%;
//   object-fit: cover;
//   border: 3px solid #fff;
// `;

// const UserInfo = styled.div`
//   flex: 1;
//   h1 {
//     font-size: 2rem;
//     margin-bottom: 0.5rem;
//   }
//   p {
//     margin: 0.2rem 0;
//   }
//   span {
//     font-size: 0.9rem;
//     opacity: 0.8;
//   }
// `;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  background: #fff;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: ${({ active }) => (active ? "#111" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${({ active }) => (active ? "#111" : "#f0f0f0")};
  }
`;

const Content = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const ProfileSection = styled.div`
  h2 {
    margin-bottom: 1.5rem;
    font-size: 1.6rem;
  }
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  line-height: 1.8;
`;

const SettingsSection = styled.div`
  h2 {
    margin-bottom: 1.5rem;
    font-size: 1.6rem;
  }
  h3 {
    margin: 1.5rem 0 0.8rem;
    font-size: 1.2rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  label {
    display: flex;
    flex-direction: column;
    font-size: 0.95rem;
    color: #333;

    input {
      padding: 0.8rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      margin-top: 0.5rem;
      font-size: 1rem;
    }

    input:focus {
      border-color: #111;
      outline: none;
    }
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 1.5rem 0;
`;

const SaveButton = styled.button`
  padding: 0.8rem 1.2rem;
  background: #111;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: #333;
  }
`;
