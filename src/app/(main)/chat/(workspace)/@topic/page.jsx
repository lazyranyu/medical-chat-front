// import TopicListContent from './features/TopicListContent';
import React, { Suspense, lazy } from 'react';


import Desktop from './_layout/Desktop';
import SkeletonList from './features/SkeletonList';
import SystemRole from './features/SystemRole';

const TopicContent = lazy(() => import('./features/TopicListContent'));

const Topic = async () => {

    const Layout = Desktop;

    return (
        <>
            {<SystemRole />}
            <Layout>
                <Suspense fallback={<SkeletonList />}>
                    <TopicContent />
                </Suspense>
            </Layout>
        </>
    );
};

Topic.displayName = 'ChatTopic';

export default Topic;
