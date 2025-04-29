import { RouteObject, Navigate } from 'react-router-dom'
import { LayoutView } from './Layout'
import { HomeView } from './Home/Home'
import { MyView } from './My/My'
import { ProjectView } from './Project/Project'
import { CommentsView } from './Comments/Comments'
import { CommentsDetailsView } from './Comments/CommentsDetails'
import { ProblemView } from './Problem/Problem'
import { SuperviseProjectView } from './Project/SuperviseProject'
import { ProblemDetailView } from './Problem/ProblemDetail'
import { TaskListView } from './Task/TaskList'
import { TaskLineView } from './Task/TaskLine'
import { TaskDetailView } from './Task/TaskDetail'
import { ApproveTaskView } from './ApproveTask/ApproveTask'
import { ProjectInvestView } from './ProjectInvest/ProjectInvest'
import { ProjectInvestDetailView } from './ProjectInvest/ProjectInvestDetail'
import { ProjectInvestAppraiseView } from './ProjectInvest/ProjectInvestAppraise'
import { ProjectOutlineView } from './Project/ProjectOutline'
import { DingInfo } from './DingInfo/DingInfo'
import { PendingProjectInvest } from './My/PendingProjectInvest'
import { PendingTask } from './My/PendingTask'
import { DeclareProblem } from './Project/DeclareProblem'
import { ProjectInvestPage } from './Project/ProjectInvestPage'
import { ProjectDetailView } from './Project/ProjectDetail'
import { StationMessageView } from './StationMessage/StationMessage'
import { GrantRoleView } from './GrantRole/GrantRole'
import { UpdateClockView } from './Project/UpdateClock'
import { GrantRoleFormView } from './GrantRole/GrantRoleForm'
import { ProjectInvestForm } from './Project/ProjectInvestForm'
import { UpdateClockForm } from './Project/UpdateClockForm'
import { ApproveTaskDetailView } from './ApproveTask/ApproveTaskDetail'

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <LayoutView />,
        children: [
            {
                path: '/',
                element: <Navigate to={'/my'} />
            },
            {
                path: '/home',
                element: <HomeView />
            },
            {
                path: '/my',
                element: <MyView />
            },
            {
                path: '/project',
                element: <ProjectView />
            },
            {
                path: '/comments',
                element: <CommentsView />
            },
            {
                path: '/problem',
                element: <ProblemView />
            }
        ]
    },
    {
        path: '/station-message',
        element: <StationMessageView />
    },
    {
        path: '/grant-role',
        element: <GrantRoleView />
    },
    {
        path: '/grant-role-form',
        element: <GrantRoleFormView />
    },
    {
        path: '/comments-details/:id',
        element: <CommentsDetailsView />
    },
    {
        path: '/update-clock-form/:id',
        element: <UpdateClockForm />
    },
    {
        path: '/project-invest-form/:id',
        element: <ProjectInvestForm />
    },
    {
        path: '/update-clock/:id',
        element: <UpdateClockView />
    },
    {
        path: '/declare-problem/:id',
        element: <DeclareProblem />
    },
    {
        path: '/pending-project-invest',
        element: <PendingProjectInvest />
    },
    {
        path: '/pending-task',
        element: <PendingTask />
    },
    {
        path: '/ding-info/:allClose',
        element: <DingInfo />
    },
    {
        path: '/problem-detail/:id',
        element: <ProblemDetailView />
    },
    {
        path: '/project-detail/:id',
        element: <ProjectDetailView />
    },
    {
        path: '/project-outline/:id',
        element: <ProjectOutlineView />
    },
    {
        path: '/supervise-project/:id',
        element: <SuperviseProjectView />
    },
    {
        path: '/task',
        element: <TaskListView />
    },
    {
        path: '/approve-task',
        element: <ApproveTaskView />
    },
    {
        path: '/approve-task-detail/:id',
        element: <ApproveTaskDetailView />
    },
    {
        path: '/task-line/:id',
        element: <TaskLineView />
    },
    {
        path: '/task-detail/:id',
        element: <TaskDetailView />
    },
    {
        path: '/project-invest',
        element: <ProjectInvestView />
    },
    {
        path: '/project-invest-detail/:id',
        element: <ProjectInvestDetailView />
    },
    {
        path: '/project-invest-page/:id',
        element: <ProjectInvestPage />
    },
    {
        path: '/project-invest-appraise/:id',
        element: <ProjectInvestAppraiseView />
    }
]
