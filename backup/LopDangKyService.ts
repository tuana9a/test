import { Db, FilterQuery } from 'mongodb';
import { LopDangKy } from '../models/LopDangKy';
import { dbFactory } from './DbFactory';

class LopDangKyService {
    busy: boolean;
    setBusy(value: boolean) {
        this.busy = value;
    }
    async findClassesByTermAndIds(term: string, ids: Array<number>, type: string) {
        var db: Db = dbFactory.DB_REGISTER_CLASS;
        let classes: Array<LopDangKy> = [];
        let filter: FilterQuery<any> = { maLop: -1 };
        switch (type) {
            case 'match':
                filter = { maLop: { $in: ids } };
                break;
            case 'near':
                filter = {
                    $or: ids.map(function (id) {
                        let length = String(id).length;
                        let missing = 6 - length;
                        let filter: FilterQuery<any> = { maLop: id };
                        if (missing > 0) {
                            let delta = Math.pow(10, missing);
                            let gte = id * delta;
                            let lte = gte + delta;
                            filter = { maLop: { $gte: gte, $lte: lte } };
                        }
                        return filter;
                    })
                };
                break;
            default:
                break;
        }
        await db
            .collection(term)
            .find(filter)
            .forEach((each: LopDangKy) => classes.push(each));
        return classes;
    }
    async updateClasses(term: string, classes: Array<LopDangKy>) {
        var db: Db = dbFactory.DB_REGISTER_CLASS;
        this.setBusy(true);
        let count = 0;
        let collection = db.collection(term);
        for (let classs of classes) {
            delete classs.thiGiuaKi;
            delete classs.thiCuoiKi;
            collection.updateOne({ maLop: classs.maLop }, { $set: { ...classs } }, { upsert: true });
            count++;
        }
        this.setBusy(false);
        return count;
    }
    async updateClasses_MidExam(term: string, classes: Array<LopDangKy>) {
        var db: Db = dbFactory.DB_REGISTER_CLASS;
        this.setBusy(true);
        let count = 0;
        let collection = db.collection(term);
        for (let classs of classes) {
            collection.updateOne({ maLop: classs.maLop }, { $set: { thiGiuaKi: classs.thiGiuaKi } });
            count++;
        }
        this.setBusy(false);
        return count;
    }
    async updateClasses_EndExam(term: string, classes: Array<LopDangKy>) {
        var db: Db = dbFactory.DB_REGISTER_CLASS;
        this.setBusy(true);
        let count = 0;
        let collection = db.collection(term);
        for (let classs of classes) {
            collection.updateOne({ maLop: classs.maLop }, { $set: { thiCuoiKi: classs.thiCuoiKi } });
            count++;
        }
        this.setBusy(false);
        return count;
    }
    async deleteClasses(term: string) {
        var db: Db = dbFactory.DB_REGISTER_CLASS;
        let collection = db.collection(term);
        let operationResult = await collection.deleteMany({});
        let count = operationResult.deletedCount;
        return count;
    }
    async deleteClasses_MidExam(term: string) {
        var db: Db = dbFactory.DB_REGISTER_CLASS;
        let collection = db.collection(term);
        let operationResult = await collection.updateMany({}, { $set: { thiGiuaKi: [] } });
        let count = operationResult.modifiedCount;
        return count;
    }
    async deleteClasses_EndExam(term: string) {
        var db: Db = dbFactory.DB_REGISTER_CLASS;
        let collection = db.collection(term);
        let operationResult = await collection.updateMany({}, { $set: { thiCuoiKi: [] } });
        let count = operationResult.modifiedCount;
        return count;
    }
}

export const lopDangKyService = new LopDangKyService();
