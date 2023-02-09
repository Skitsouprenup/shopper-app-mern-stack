import mongoose from "mongoose";

/*
  to fix deprecation warning

  Mongoose: the `strictQuery` option will be switched back to `false` by default in
  Mongoose 7. Use `mongoose.set('strictQuery', false);` if you want to prepare for this
  change. Or use `mongoose.set('strictQuery', true);` to suppress this warning.
*/
mongoose.set('strictQuery', false);
const initConnection = () => {
    const uri = process.env.MONGODB_URI;
    mongoose.
    connect(uri ? uri : '').
    catch((e) => {
        console.error('Error connecting to database.');
        console.error(e);
    });
}

export default initConnection;