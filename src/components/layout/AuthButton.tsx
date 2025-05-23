import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Settings } from 'lucide-react';
import supabase from '@/lib/supabase';

const AuthButton = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        // First try to get user metadata from auth
        const metadata = user.user_metadata;
        
        if (metadata?.name) {
          setUserName(metadata.name);
          console.log('Using name from metadata:', metadata.name);
          return;
        }
        
        // If not available in metadata, check from the session data
        const { data: sessionData } = await supabase.auth.getSession();
        const sessionMetadata = sessionData?.session?.user?.user_metadata;
        
        if (sessionMetadata?.name) {
          setUserName(sessionMetadata.name);
          console.log('Using name from session metadata:', sessionMetadata.name);
          return;
        }
        
        console.log('Falling back to email for user display');
        setUserName(user.email?.split('@')[0] || '');
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserName(user.email?.split('@')[0] || '');
      }
    };
    
    fetchUserProfile();
  }, [user]);

  if (!user) return null;

  // Get initials from name or email
  const getInitials = () => {
    if (userName) {
      const nameParts = userName.trim().split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
      }
      return userName.charAt(0).toUpperCase();
    }
    
    // Fall back to email if no name
    const email = user.email || '';
    return email.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {userName && <p className="font-medium">{userName}</p>}
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Pengaturan</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={async () => {
            await signOut();
            navigate('/login');
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
