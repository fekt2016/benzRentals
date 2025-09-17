import React from "react";
import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
  min-width: 700px;

  th,
  td {
    padding: 1rem;
    text-align: left;
  }

  th {
    border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
  }

  td {
    background: ${({ theme }) => theme.colors.white};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
    border-radius: var(--radius-sm);
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

const CardList = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const UserCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1rem;
  border-radius: var(--radius-lg);
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  div {
    display: flex;
    justify-content: space-between;
  }
`;

const ActionBtn = styled.button`
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  background-color: ${({ color }) => color || "#333"};
  color: white;
  margin-right: 0.5rem;

  &:hover {
    opacity: 0.8;
  }
`;

const UsersManagementPage = () => {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "user" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "admin" },
  ];

  return (
    <Container>
      <Title>Manage Users</Title>

      {/* Desktop Table */}
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <ActionBtn color="#FFA500" title="Edit">
                  <FaEdit />
                </ActionBtn>
                <ActionBtn color="#FF4C4C" title="Delete">
                  <FaTrash />
                </ActionBtn>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Mobile Cards */}
      <CardList>
        {users.map((u) => (
          <UserCard key={u.id}>
            <div>
              <span>Name:</span>
              <span>{u.name}</span>
            </div>
            <div>
              <span>Email:</span>
              <span>{u.email}</span>
            </div>
            <div>
              <span>Role:</span>
              <span>{u.role}</span>
            </div>
            <div>
              <ActionBtn color="#FFA500" title="Edit">
                <FaEdit />
              </ActionBtn>
              <ActionBtn color="#FF4C4C" title="Delete">
                <FaTrash />
              </ActionBtn>
            </div>
          </UserCard>
        ))}
      </CardList>
    </Container>
  );
};

export default UsersManagementPage;
