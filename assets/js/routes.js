import Dashboard from './components/PageComponents/Dashboard.vue';
import Summary from './components/PageComponents/Summary.vue'
import NewAssessment from './components/PageComponents/NewAssessment.vue';
import EditAssessment from './components/PageComponents/EditAssessment.vue';
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
		path: '/summary/:id',
		component: Summary
	},
	{
		path: '/new-assessment',
		component: NewAssessment
	},
	{
		path: '/edit/:assessmentMetadataId/:examinatorId',
		component: EditAssessment
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
