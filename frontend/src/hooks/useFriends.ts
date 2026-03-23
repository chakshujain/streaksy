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

export interface EnrichedFriend extends Friend {
  shared_groups?: { id: string; name: string }[];
  active_roadmaps?: { id: string; name: string; template_slug: string | null }[];
  active_rooms?: { id: string; name: string; code: string; status: string }[];
}

export function useFriends() {
  const { data, loading, refetch } = useAsync<Friend[]>(
    () => friendsApi.list().then((r: { data: { friends?: Friend[] } }) => r.data.friends || []),
    []
  );
  return { friends: data || [], loading, refetch };
}

export function useEnrichedFriends() {
  const { data, loading, refetch } = useAsync<EnrichedFriend[]>(
    () => friendsApi.listEnriched().then((r: { data: { friends?: EnrichedFriend[] } }) => r.data.friends || []),
    []
  );
  return { friends: data || [], loading, refetch };
}
