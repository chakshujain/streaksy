import { useAsync } from './useAsync';
import { friendsApi } from '@/lib/api';

export interface Friend {
  friendship_id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  current_streak: number;
  total_points: number;
  last_active: string | null;
}

export function useFriends() {
  const { data, loading, refetch } = useAsync<Friend[]>(
    () => friendsApi.list().then((r: { data: { friends?: Friend[] } }) => r.data.friends || []),
    []
  );
  return { friends: data || [], loading, refetch };
}
