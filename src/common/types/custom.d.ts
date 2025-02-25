
import { Admin } from '../../models/Admin/Admin.model'; 

declare global {
  namespace Express {
    interface Request {
      user?: Admin; 
    }
  }
}
