import React, { useState } from 'react';
import { Page, User, PreviewData } from '../../types';
import { UserListPage } from './users/UserListPage';
import { DivisionListPage } from './divisions/DivisionListPage';

interface UsersHubPageProps {
    currentUser: User;
    setActivePage: (page: Page, initialState?: any) => void;
    onShowPreview: (data: PreviewData) => void;
    pageInitialState?: any;
}

export const UsersHubPage: React.FC<UsersHubPageProps> = (props) => {
    const { pageInitialState } = props;
    const [activeView, setActiveView] = useState<'users' | 'divisions'>(
        pageInitialState?.view === 'divisions' ? 'divisions' : 'users'
    );

    return (
        <div>
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex -mb-px space-x-6" aria-label="Tabs">
                    <button 
                        onClick={() => setActiveView('users')} 
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${
                            activeView === 'users' 
                                ? 'border-tm-primary text-tm-primary' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Manajemen Akun
                    </button>
                    <button 
                        onClick={() => setActiveView('divisions')} 
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${
                            activeView === 'divisions' 
                                ? 'border-tm-primary text-tm-primary' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Manajemen Divisi
                    </button>
                </nav>
            </div>

            {activeView === 'users' ? (
                <UserListPage {...props} />
            ) : (
                <DivisionListPage {...props} />
            )}
        </div>
    );
};

