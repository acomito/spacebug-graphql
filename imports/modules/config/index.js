import { Meteor } from 'meteor/meteor';


export const appConfig = {
	//app
	appName: Meteor.settings.public.config.appName,
	//support
	supportEmail: Meteor.settings.public.config.supportEmail,
	supportName: Meteor.settings.public.config.supportName,
};

export const PRODUCTION_URL = 'https://buysellloan.meteorapp.com';

export const DEFAULT_AVATAR = '/avatar.png';

export const ROLE_OPTIONS = [
	'admin',
	'u1'
];

export const USER_MODEL_TYPES = [
	'admin',
	'u1'
];

