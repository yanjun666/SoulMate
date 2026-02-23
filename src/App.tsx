import { useState, useCallback } from 'react';
import type { PageType, UserProfile, Match } from '@/types';
import { matches as initialMatches, discoverUsers } from '@/data/mockData';
import { Navigation } from '@/components/Navigation';
import { MatchModal } from '@/components/MatchModal';
import { DiscoverPage } from '@/pages/DiscoverPage';
import { MatchesPage } from '@/pages/MatchesPage';
import { ChatListPage, ConversationPage } from '@/pages/ChatPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { PremiumPage } from '@/pages/PremiumPage';
import { DeployGuidePage } from '@/pages/DeployGuidePage';
import { PWAGuidePage } from '@/pages/PWAGuidePage';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('discover');
  const [isVip, setIsVip] = useState(false);
  const [matchList, setMatchList] = useState<Match[]>(initialMatches);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [conversationUserId, setConversationUserId] = useState<string | null>(null);
  const [_pageData, setPageData] = useState<Record<string, unknown>>({});

  const totalUnread = matchList.reduce((sum, m) => sum + m.unread, 0);

  const handleNavigate = useCallback((page: PageType, data?: Record<string, unknown>) => {
    if (data) setPageData(data);
    if (page === 'conversation' && data?.userId) {
      setConversationUserId(data.userId as string);
    }
    setCurrentPage(page);
  }, []);

  const handleMatch = useCallback((user: UserProfile) => {
    setMatchedUser(user);
    const existsMatch = matchList.find((m) => m.user.id === user.id);
    if (!existsMatch) {
      const newMatch: Match = {
        id: `m-${Date.now()}`,
        user,
        matchedAt: '刚刚',
        lastMessage: '',
        unread: 0,
      };
      setMatchList((prev) => [newMatch, ...prev]);
    }
  }, [matchList]);

  const handleMatchChat = useCallback(() => {
    if (matchedUser) {
      setConversationUserId(matchedUser.id);
      setCurrentPage('conversation');
      setMatchedUser(null);
    }
  }, [matchedUser]);

  const handleToggleVip = useCallback(() => {
    setIsVip((prev) => !prev);
  }, []);

  const conversationMatch = matchList.find(
    (m) => m.user.id === conversationUserId
  ) || (conversationUserId ? {
    id: `temp-${conversationUserId}`,
    user: discoverUsers.find((u) => u.id === conversationUserId) || discoverUsers[0],
    matchedAt: '刚刚',
    lastMessage: '',
    unread: 0,
  } : null);

  const showNav = !['conversation', 'user-detail', 'deploy-guide', 'pwa-guide'].includes(currentPage);

  return (
    <div className="mx-auto flex h-screen max-w-lg flex-col overflow-hidden bg-white shadow-2xl">
      {/* Page Content */}
      <div className="flex-1 overflow-hidden">
        {currentPage === 'discover' && (
          <DiscoverPage
            onNavigate={handleNavigate}
            onMatch={handleMatch}
            isVip={isVip}
          />
        )}
        {currentPage === 'matches' && (
          <MatchesPage
            matches={matchList}
            onNavigate={handleNavigate}
            isVip={isVip}
          />
        )}
        {currentPage === 'chat' && (
          <ChatListPage
            matches={matchList}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'conversation' && conversationMatch && (
          <ConversationPage
            match={conversationMatch}
            onBack={() => setCurrentPage('chat')}
            isVip={isVip}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'profile' && (
          <ProfilePage
            onNavigate={handleNavigate}
            isVip={isVip}
            onToggleVip={handleToggleVip}
          />
        )}
        {currentPage === 'premium' && (
          <PremiumPage
            onNavigate={handleNavigate}
            isVip={isVip}
            onToggleVip={handleToggleVip}
          />
        )}
        {currentPage === 'deploy-guide' && (
          <DeployGuidePage onNavigate={handleNavigate} />
        )}
        {currentPage === 'pwa-guide' && (
          <PWAGuidePage onNavigate={handleNavigate} />
        )}
      </div>

      {/* Bottom Navigation */}
      {showNav && (
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          unreadCount={totalUnread}
        />
      )}

      {/* Match Modal */}
      {matchedUser && (
        <MatchModal
          user={matchedUser}
          onChat={handleMatchChat}
          onClose={() => setMatchedUser(null)}
        />
      )}
    </div>
  );
}
