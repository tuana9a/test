package com.tuana9a;

import java.io.*;
// import java.math.*;
// import java.security.*;
// import java.text.*;
// import java.util.*;
// import java.util.concurrent.*;
// import java.util.function.*;
// import java.util.regex.*;
// import java.util.stream.*;
// import static java.util.stream.Collectors.joining;
// import static java.util.stream.Collectors.toList;


class Result {

    /*
     * Complete the 'getMaxOccurrences' function below.
     *
     * The function is expected to return an INTEGER.
     * The function accepts following parameters:
     *  1. STRING components
     *  2. INTEGER minLength
     *  3. INTEGER maxLength
     *  4. INTEGER maxUnique
     */

    public static int getMaxOccurrences(String components, int minLength, int maxLength, int maxUnique) {
    // Write your code here
        int result = 0;
        int compsLength = components.length();
        int minLengthDeltaIdx = minLength - 1;
        int maxLengthDeltaIdx = maxLength - 1;
        int leftIdx = 0;
        int rightIdx = leftIdx + minLengthDeltaIdx;
        int maxLeftIdx = compsLength - minLength;
        int maxRightIdx = compsLength - 1;
        int[] uniqueCount = new int[100];
        while(leftIdx < maxLeftIdx) {
            for(int i = leftIdx; i <= rightIdx; i++) {
                int c = components.charAt(i);
                int id = c - '0';
                uniqueCount[id] = uniqueCount[id] + 1;
                if (uniqueCount[id] > maxUnique) {
                    uniqueCount[id] = uniqueCount[id] - 1;
                    break;
                }
                if (i == rightIdx) {
                    result++;
                    if (rightIdx - leftIdx < maxLengthDeltaIdx && rightIdx < maxRightIdx) {
                        rightIdx++;
                    }
                }
            }
            int leftId = components.charAt(leftIdx) - '0';
            uniqueCount[leftId] = uniqueCount[leftId] - 1;
            leftIdx = leftIdx + 1;
            if (rightIdx - leftId < minLengthDeltaIdx && rightIdx < maxRightIdx) {
                rightIdx ++;
            }
        }
        return result;
    }

}
public class Test1 {
    public static void main(String[] args) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(System.getenv("OUTPUT_PATH")));

        String components = bufferedReader.readLine();

        int minLength = Integer.parseInt(bufferedReader.readLine().trim());

        int maxLength = Integer.parseInt(bufferedReader.readLine().trim());

        int maxUnique = Integer.parseInt(bufferedReader.readLine().trim());

        int result = Result.getMaxOccurrences(components, minLength, maxLength, maxUnique);

        bufferedWriter.write(String.valueOf(result));
        bufferedWriter.newLine();

        bufferedReader.close();
        bufferedWriter.close();
    }
}