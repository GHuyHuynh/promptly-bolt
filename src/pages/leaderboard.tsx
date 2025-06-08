import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Trophy, Medal, Award } from 'lucide-react';
import { mockApi, MockUser } from '../data/mockData';

export default function LeaderboardPage() {
  const [users, setUsers] = useState<MockUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.users.getLeaderboard().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-yellow-200 bg-yellow-50';
      case 2:
        return 'border-gray-200 bg-gray-50';
      case 3:
        return 'border-amber-200 bg-amber-50';
      default:
        return 'border-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600">See how you rank against other learners</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user, index) => {
              const rank = index + 1;
              return (
                <div
                  key={user._id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md ${getRankColor(rank)}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(rank)}
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {user.name || 'Anonymous User'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Level {user.level || 1}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {user.totalScore || 0} XP
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {user.currentStreak || 0} day streak
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {users.length === 0 && (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No rankings yet
              </h3>
              <p className="text-gray-600">
                Start learning to appear on the leaderboard!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}