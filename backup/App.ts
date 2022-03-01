class AppRuntime {
    private config: any = {};
    get(path: string) {
        let paths = path.split('.');
        try {
            return paths.reduce(function (pointer: any, cur: string) {
                return pointer[cur];
            }, this.config);
        } catch (e) {
            return '';
        }
    }
    set(path: string, value: string) {
        let paths = path.split('.');
        let length = paths.length;
        let p = paths.reduce(function (pointer: any, cur: string, i: number) {
            if (i == length - 1) return pointer;
            let check = pointer[cur];
            if (!check) pointer[cur] = {};
            return pointer[cur];
        }, this.config);
        p[paths[length - 1]] = value;
    }
}