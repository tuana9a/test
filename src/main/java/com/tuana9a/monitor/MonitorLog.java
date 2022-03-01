package com.tuana9a.monitor;

import java.util.TreeMap;

public class MonitorLog extends TreeMap<String, String> {

    public MonitorLog() {
    }

    public MonitorLog append(String key, String value) {
        put(key, value);
        return this;
    }

    public String getAttribute(String key) {
        return get(key);
    }
}
