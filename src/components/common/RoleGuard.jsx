import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from './UI';

const RoleGuard = ({ children, roles = [] }) => {
    const { user } = useAuth();
    
    const hasAccess = roles.length === 0 || roles.includes(user?.role);

    if (!hasAccess) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <Card className="text-center max-w-md">
                    <div className="text-5xl mb-4">🚫</div>
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p className="text-dim mb-6">
                        Your account profile (**{user?.role}**) does not have the synchronization clearance required to access this operations module.
                    </p>
                    <p className="text-xs text-slate-500 italic">
                        Please contact the Systems Administrator if you believe this is an error.
                    </p>
                </Card>
            </div>
        );
    }

    return children;
};

export default RoleGuard;
