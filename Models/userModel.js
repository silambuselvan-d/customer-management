/**
 * Model file to handle all the database connection logics
 */
const path = require('path');
const { UserSchema } = require('../schema/index');
const { UserJson } = require('../inputs/index');
const { Logger } = require('../helpers/index');


/**
 * Get user
 *
 * @function GetUser
 * @param {object} - loginid and password object
 * @returns {object} - returns user data from db
 * @author SIlambuselvam
 */
const GetUser = async ({ loginId, password = false }) => {
  try {
		Logger.log('info', 'Find user detail in database');
		const user = await UserSchema.findOne({ loginId }).lean();
		if(!user) {
			return { message: 'User not found' };
		}else {
			if(password) {
				if(user.password === password) {
					return user;
				} else {
					return { message: 'Password Mismatch' };
				}
			}else {
				return user;
			}
		}
  } catch (exc) {
		Logger.log('error', `Error in GetUser module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
		throw exc;
  }
};


const PopulateUserData = async () => {
	try {
		Logger.log('info', 'Inser customer data into database');
		const bulkWriteQueries = UserJson.reduce((acc, val) => {
			return [
				...acc,
				{
					updateOne: {
						filter: { loginId: val.loginId },
						update: { $set: val },
						upsert: true
					}
				}
			];
		}, []);
		await UserSchema.bulkWrite(bulkWriteQueries, {});
	} catch (exc) {
		Logger.log('error', `Error in PopulateUserData module in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
		throw exc;
	}
};


module.exports = {
	PopulateUserData,
	GetUser
};
