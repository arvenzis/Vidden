import Dashboard from './components/PageComponents/Dashboard.vue';
import NewAssessment from './components/PageComponents/NewAssessment.vue';
import Browse from './components/PageComponents/Browse.vue';
import Settings from './components/PageComponents/Settings.vue';

const routes = [{
		path: '/',
		component: Dashboard
	},
	{
		path: '/dashboard',
		component: Dashboard
	},
	{
		path: '/new-assessment',
		component: NewAssessment
	},
	{
		path: '/browse',
		component: Browse
	},
	{
		path: '/settings',
		component: Settings
	}
];

export default routes;
