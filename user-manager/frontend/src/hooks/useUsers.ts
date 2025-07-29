import { useState, useEffect, useCallback } from "react";
import UsersApi from "../api/usersApi";
import { UserResponse } from "../models/models";

export function useUsers() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await UsersApi.getAllUsers();
      setUsers(data);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  const blockUsers = useCallback(
    async (ids: number[]) => {
      setLoading(true);
      setError(null);
      try {
        await UsersApi.blockUsers(ids);
        await loadUsers();
      } catch {
        setError("Failed to block users");
      } finally {
        setLoading(false);
      }
    },
    [loadUsers]
  );

  const unblockUsers = useCallback(
    async (ids: number[]) => {
      setLoading(true);
      setError(null);
      try {
        await UsersApi.unblockUsers(ids);
        await loadUsers();
      } catch {
        setError("Failed to unblock users");
      } finally {
        setLoading(false);
      }
    },
    [loadUsers]
  );

  const deleteUsers = useCallback(
    async (ids: number[]) => {
      setLoading(true);
      setError(null);
      try {
        await UsersApi.deleteUsers(ids);
        await loadUsers();
      } catch {
        setError("Failed to delete users");
      } finally {
        setLoading(false);
      }
    },
    [loadUsers]
  );

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    loading,
    error,
    blockUsers,
    unblockUsers,
    deleteUsers,
    reload: loadUsers,
  };
}
