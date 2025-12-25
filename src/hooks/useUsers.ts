import { useDataStore } from "@/store/data.store";
import { useShallow } from "zustand/react/shallow";

export function useUsers() {
  const { users, loading, fetchUsers } = useDataStore(
    useShallow((state) => ({
      users: state.users,
      loading: state.loading.users,
      fetchUsers: state.fetchUsers,
    }))
  );

  // Users are fetched via store for the list view

  return {
    users,
    isLoading: loading,
    fetchUsers,
  };
}
