import React, { useMemo } from "react";
import styled from "styled-components";
import { FaTrash } from "react-icons/fa";
import { useGetUsers } from "../../hooks/useUser";

const UsersManagementPage = () => {
  const { data: usersData } = useGetUsers();
  console.log("usersData", usersData);

  const users = useMemo(() => {
    return usersData?.data?.data || [];
  }, [usersData]);

  return (
    <Container>
      <h1>Manage Users</h1>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Active</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <Td>{u.fullName}</Td>
              <Td>{u.email}</Td>
              <Td>{u.role}</Td>
              <Td>{u.active ? "Yes" : "No"}</Td>
              <Td>
                <ActionBtn>
                  <FaTrash />
                </ActionBtn>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UsersManagementPage;
const Container = styled.div`
  padding: 2rem;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
`;
const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
`;
const ActionBtn = styled.button`
  color: ${({ theme }) => theme.colors.primary};
  &:hover {
    opacity: 0.7;
  }
`;
