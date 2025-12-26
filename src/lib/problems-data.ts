import { Problem } from '@/types';

export const problemsDatabase: Problem[] = [
  // ==================== EASY PROBLEMS ====================
  {
    id: '1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Your code here
    pass`,
      javascript: `function twoSum(nums, target) {
    // Your code here
}`,
    },
    testCases: [
      { id: '1-1', input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isHidden: false },
      { id: '1-2', input: '[3,2,4]\n6', expectedOutput: '[1,2]', isHidden: false },
      { id: '1-3', input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: false },
      { id: '1-4', input: '[1,5,8,3,9,2]\n11', expectedOutput: '[2,3]', isHidden: true },
      { id: '1-5', input: '[-1,-2,-3,-4,-5]\n-8', expectedOutput: '[2,4]', isHidden: true },
    ],
    tags: ['Array', 'Hash Table'],
    solveCount: 15420,
    successRate: 78.5,
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'easy',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
      },
      {
        input: 's = "(]"',
        output: 'false',
      },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.',
    ],
    starterCode: {
      python: `def isValid(s: str) -> bool:
    # Your code here
    pass`,
      javascript: `function isValid(s) {
    // Your code here
}`,
    },
    testCases: [
      { id: '2-1', input: '()', expectedOutput: 'true', isHidden: false },
      { id: '2-2', input: '()[]{}', expectedOutput: 'true', isHidden: false },
      { id: '2-3', input: '(]', expectedOutput: 'false', isHidden: false },
      { id: '2-4', input: '([)]', expectedOutput: 'false', isHidden: true },
      { id: '2-5', input: '{[]}', expectedOutput: 'true', isHidden: true },
      { id: '2-6', input: '((((((()))))))', expectedOutput: 'true', isHidden: true },
    ],
    tags: ['String', 'Stack'],
    solveCount: 12350,
    successRate: 72.3,
  },
  {
    id: '3',
    title: 'Palindrome Number',
    slug: 'palindrome-number',
    difficulty: 'easy',
    description: `Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.

An integer is a **palindrome** when it reads the same backward as forward.
- For example, \`121\` is a palindrome while \`123\` is not.`,
    examples: [
      {
        input: 'x = 121',
        output: 'true',
        explanation: '121 reads as 121 from left to right and from right to left.',
      },
      {
        input: 'x = -121',
        output: 'false',
        explanation: 'From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.',
      },
      {
        input: 'x = 10',
        output: 'false',
        explanation: 'Reads 01 from right to left. Therefore it is not a palindrome.',
      },
    ],
    constraints: [
      '-2^31 <= x <= 2^31 - 1',
    ],
    starterCode: {
      python: `def isPalindrome(x: int) -> bool:
    # Your code here
    pass`,
      javascript: `function isPalindrome(x) {
    // Your code here
}`,
    },
    testCases: [
      { id: '3-1', input: '121', expectedOutput: 'true', isHidden: false },
      { id: '3-2', input: '-121', expectedOutput: 'false', isHidden: false },
      { id: '3-3', input: '10', expectedOutput: 'false', isHidden: false },
      { id: '3-4', input: '12321', expectedOutput: 'true', isHidden: true },
      { id: '3-5', input: '0', expectedOutput: 'true', isHidden: true },
    ],
    tags: ['Math'],
    solveCount: 14200,
    successRate: 82.1,
  },
  {
    id: '4',
    title: 'Reverse String',
    slug: 'reverse-string',
    difficulty: 'easy',
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array **in-place** with O(1) extra memory.`,
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is a printable ascii character.',
    ],
    starterCode: {
      python: `def reverseString(s: list[str]) -> None:
    # Modify s in-place
    pass`,
      javascript: `function reverseString(s) {
    // Modify s in-place
}`,
    },
    testCases: [
      { id: '4-1', input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', isHidden: false },
      { id: '4-2', input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]', isHidden: false },
      { id: '4-3', input: '["a"]', expectedOutput: '["a"]', isHidden: true },
      { id: '4-4', input: '["a","b"]', expectedOutput: '["b","a"]', isHidden: true },
    ],
    tags: ['String', 'Two Pointers'],
    solveCount: 18500,
    successRate: 85.2,
  },
  {
    id: '5',
    title: 'FizzBuzz',
    slug: 'fizzbuzz',
    difficulty: 'easy',
    description: `Given an integer \`n\`, return a string array \`answer\` (1-indexed) where:
- \`answer[i] == "FizzBuzz"\` if \`i\` is divisible by 3 and 5.
- \`answer[i] == "Fizz"\` if \`i\` is divisible by 3.
- \`answer[i] == "Buzz"\` if \`i\` is divisible by 5.
- \`answer[i] == i\` (as a string) if none of the above conditions are true.`,
    examples: [
      {
        input: 'n = 3',
        output: '["1","2","Fizz"]',
      },
      {
        input: 'n = 5',
        output: '["1","2","Fizz","4","Buzz"]',
      },
      {
        input: 'n = 15',
        output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
      },
    ],
    constraints: [
      '1 <= n <= 10^4',
    ],
    starterCode: {
      python: `def fizzBuzz(n: int) -> list[str]:
    # Your code here
    pass`,
      javascript: `function fizzBuzz(n) {
    // Your code here
}`,
    },
    testCases: [
      { id: '5-1', input: '3', expectedOutput: '["1","2","Fizz"]', isHidden: false },
      { id: '5-2', input: '5', expectedOutput: '["1","2","Fizz","4","Buzz"]', isHidden: false },
      { id: '5-3', input: '15', expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', isHidden: false },
      { id: '5-4', input: '1', expectedOutput: '["1"]', isHidden: true },
    ],
    tags: ['Math', 'String', 'Simulation'],
    solveCount: 22100,
    successRate: 89.4,
  },
  {
    id: '6',
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'easy',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A **subarray** is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'The subarray [1] has the largest sum 1.',
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23',
        explanation: 'The subarray [5,4,-1,7,8] has the largest sum 23.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    starterCode: {
      python: `def maxSubArray(nums: list[int]) -> int:
    # Your code here
    pass`,
      javascript: `function maxSubArray(nums) {
    // Your code here
}`,
    },
    testCases: [
      { id: '6-1', input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isHidden: false },
      { id: '6-2', input: '[1]', expectedOutput: '1', isHidden: false },
      { id: '6-3', input: '[5,4,-1,7,8]', expectedOutput: '23', isHidden: false },
      { id: '6-4', input: '[-1]', expectedOutput: '-1', isHidden: true },
      { id: '6-5', input: '[-2,-1]', expectedOutput: '-1', isHidden: true },
    ],
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    solveCount: 11200,
    successRate: 68.9,
  },
  {
    id: '7',
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    difficulty: 'easy',
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: 'true',
      },
      {
        input: 'nums = [1,2,3,4]',
        output: 'false',
      },
      {
        input: 'nums = [1,1,1,3,3,4,3,2,4,2]',
        output: 'true',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
    ],
    starterCode: {
      python: `def containsDuplicate(nums: list[int]) -> bool:
    # Your code here
    pass`,
      javascript: `function containsDuplicate(nums) {
    // Your code here
}`,
    },
    testCases: [
      { id: '7-1', input: '[1,2,3,1]', expectedOutput: 'true', isHidden: false },
      { id: '7-2', input: '[1,2,3,4]', expectedOutput: 'false', isHidden: false },
      { id: '7-3', input: '[1,1,1,3,3,4,3,2,4,2]', expectedOutput: 'true', isHidden: false },
      { id: '7-4', input: '[1]', expectedOutput: 'false', isHidden: true },
    ],
    tags: ['Array', 'Hash Table', 'Sorting'],
    solveCount: 16800,
    successRate: 79.3,
  },

  // ==================== MEDIUM PROBLEMS ====================
  {
    id: '8',
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'medium',
    description: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping.',
      },
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= starti <= endi <= 10^4',
    ],
    starterCode: {
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    # Your code here
    pass`,
      javascript: `function merge(intervals) {
    // Your code here
}`,
    },
    testCases: [
      { id: '8-1', input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]', isHidden: false },
      { id: '8-2', input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]', isHidden: false },
      { id: '8-3', input: '[[1,4],[0,4]]', expectedOutput: '[[0,4]]', isHidden: true },
      { id: '8-4', input: '[[1,4],[2,3]]', expectedOutput: '[[1,4]]', isHidden: true },
    ],
    tags: ['Array', 'Sorting'],
    solveCount: 8920,
    successRate: 65.2,
  },
  {
    id: '9',
    title: 'LRU Cache',
    slug: 'lru-cache',
    difficulty: 'medium',
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with **positive** size \`capacity\`.
- \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, **evict** the least recently used key.

The functions \`get\` and \`put\` must each run in **O(1)** average time complexity.`,
    examples: [
      {
        input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
        output: '[null,null,null,1,null,-1,null,-1,3,4]',
        explanation: 'LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); // cache is {1=1}\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4',
      },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.',
    ],
    starterCode: {
      python: `class LRUCache:
    def __init__(self, capacity: int):
        # Your code here
        pass

    def get(self, key: int) -> int:
        # Your code here
        pass

    def put(self, key: int, value: int) -> None:
        # Your code here
        pass`,
      javascript: `class LRUCache {
    constructor(capacity) {
        // Your code here
    }
    
    get(key) {
        // Your code here
    }
    
    put(key, value) {
        // Your code here
    }
}`,
    },
    testCases: [
      { id: '9-1', input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', expectedOutput: '[null,null,null,1,null,-1,null,-1,3,4]', isHidden: false },
      { id: '9-2', input: '["LRUCache","put","get"]\n[[1],[2,1],[2]]', expectedOutput: '[null,null,1]', isHidden: true },
    ],
    tags: ['Hash Table', 'Linked List', 'Design'],
    solveCount: 6540,
    successRate: 58.7,
  },
  {
    id: '10',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating',
    difficulty: 'medium',
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3. Notice that "pwke" is a subsequence and not a substring.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
    starterCode: {
      python: `def lengthOfLongestSubstring(s: str) -> int:
    # Your code here
    pass`,
      javascript: `function lengthOfLongestSubstring(s) {
    // Your code here
}`,
    },
    testCases: [
      { id: '10-1', input: 'abcabcbb', expectedOutput: '3', isHidden: false },
      { id: '10-2', input: 'bbbbb', expectedOutput: '1', isHidden: false },
      { id: '10-3', input: 'pwwkew', expectedOutput: '3', isHidden: false },
      { id: '10-4', input: '', expectedOutput: '0', isHidden: true },
      { id: '10-5', input: 'au', expectedOutput: '2', isHidden: true },
    ],
    tags: ['Hash Table', 'String', 'Sliding Window'],
    solveCount: 9850,
    successRate: 62.1,
  },
  {
    id: '11',
    title: 'Add Two Numbers',
    slug: 'add-two-numbers',
    difficulty: 'medium',
    description: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.',
      },
      {
        input: 'l1 = [0], l2 = [0]',
        output: '[0]',
      },
      {
        input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]',
        output: '[8,9,9,9,0,0,0,1]',
      },
    ],
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100].',
      '0 <= Node.val <= 9',
      'It is guaranteed that the list represents a number that does not have leading zeros.',
    ],
    starterCode: {
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def addTwoNumbers(l1: ListNode, l2: ListNode) -> ListNode:
    # Your code here
    pass`,
      javascript: `// Definition for singly-linked list.
// function ListNode(val, next) {
//     this.val = (val===undefined ? 0 : val)
//     this.next = (next===undefined ? null : next)
// }

function addTwoNumbers(l1, l2) {
    // Your code here
}`,
    },
    testCases: [
      { id: '11-1', input: '[2,4,3]\n[5,6,4]', expectedOutput: '[7,0,8]', isHidden: false },
      { id: '11-2', input: '[0]\n[0]', expectedOutput: '[0]', isHidden: false },
      { id: '11-3', input: '[9,9,9,9,9,9,9]\n[9,9,9,9]', expectedOutput: '[8,9,9,9,0,0,0,1]', isHidden: false },
    ],
    tags: ['Linked List', 'Math', 'Recursion'],
    solveCount: 8200,
    successRate: 59.8,
  },
  {
    id: '12',
    title: '3Sum',
    slug: 'three-sum',
    difficulty: 'medium',
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.\nnums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.\nnums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.\nThe distinct triplets are [-1,0,1] and [-1,-1,2].',
      },
      {
        input: 'nums = [0,1,1]',
        output: '[]',
        explanation: 'The only possible triplet does not sum up to 0.',
      },
      {
        input: 'nums = [0,0,0]',
        output: '[[0,0,0]]',
        explanation: 'The only possible triplet sums up to 0.',
      },
    ],
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5',
    ],
    starterCode: {
      python: `def threeSum(nums: list[int]) -> list[list[int]]:
    # Your code here
    pass`,
      javascript: `function threeSum(nums) {
    // Your code here
}`,
    },
    testCases: [
      { id: '12-1', input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]', isHidden: false },
      { id: '12-2', input: '[0,1,1]', expectedOutput: '[]', isHidden: false },
      { id: '12-3', input: '[0,0,0]', expectedOutput: '[[0,0,0]]', isHidden: false },
    ],
    tags: ['Array', 'Two Pointers', 'Sorting'],
    solveCount: 7400,
    successRate: 54.3,
  },
  {
    id: '13',
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    difficulty: 'medium',
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is **guaranteed** to fit in a **32-bit** integer.

You must write an algorithm that runs in \`O(n)\` time and without using the division operation.`,
    examples: [
      {
        input: 'nums = [1,2,3,4]',
        output: '[24,12,8,6]',
      },
      {
        input: 'nums = [-1,1,0,-3,3]',
        output: '[0,0,9,0,0]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
      'The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.',
    ],
    starterCode: {
      python: `def productExceptSelf(nums: list[int]) -> list[int]:
    # Your code here
    pass`,
      javascript: `function productExceptSelf(nums) {
    // Your code here
}`,
    },
    testCases: [
      { id: '13-1', input: '[1,2,3,4]', expectedOutput: '[24,12,8,6]', isHidden: false },
      { id: '13-2', input: '[-1,1,0,-3,3]', expectedOutput: '[0,0,9,0,0]', isHidden: false },
      { id: '13-3', input: '[2,3]', expectedOutput: '[3,2]', isHidden: true },
    ],
    tags: ['Array', 'Prefix Sum'],
    solveCount: 6100,
    successRate: 61.5,
  },
  {
    id: '14',
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    difficulty: 'medium',
    description: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in **any order**.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
      },
      {
        input: 'strs = ["a"]',
        output: '[["a"]]',
      },
    ],
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.',
    ],
    starterCode: {
      python: `def groupAnagrams(strs: list[str]) -> list[list[str]]:
    # Your code here
    pass`,
      javascript: `function groupAnagrams(strs) {
    // Your code here
}`,
    },
    testCases: [
      { id: '14-1', input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]', isHidden: false },
      { id: '14-2', input: '[""]', expectedOutput: '[[""]]', isHidden: false },
      { id: '14-3', input: '["a"]', expectedOutput: '[["a"]]', isHidden: false },
    ],
    tags: ['Array', 'Hash Table', 'String', 'Sorting'],
    solveCount: 7800,
    successRate: 66.2,
  },

  // ==================== HARD PROBLEMS ====================
  {
    id: '15',
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    difficulty: 'hard',
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.`,
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.',
      },
      {
        input: 'nums1 = [1,2], nums2 = [3,4]',
        output: '2.50000',
        explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.',
      },
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000',
      '-10^6 <= nums1[i], nums2[i] <= 10^6',
    ],
    starterCode: {
      python: `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:
    # Your code here
    pass`,
      javascript: `function findMedianSortedArrays(nums1, nums2) {
    // Your code here
}`,
    },
    testCases: [
      { id: '15-1', input: '[1,3]\n[2]', expectedOutput: '2.0', isHidden: false },
      { id: '15-2', input: '[1,2]\n[3,4]', expectedOutput: '2.5', isHidden: false },
      { id: '15-3', input: '[0,0]\n[0,0]', expectedOutput: '0.0', isHidden: true },
      { id: '15-4', input: '[]\n[1]', expectedOutput: '1.0', isHidden: true },
    ],
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    solveCount: 3210,
    successRate: 42.1,
  },
  {
    id: '16',
    title: 'Regular Expression Matching',
    slug: 'regular-expression-matching',
    difficulty: 'hard',
    description: `Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for \`'.'\` and \`'*'\` where:
- \`'.'\` Matches any single character.​​​​
- \`'*'\` Matches zero or more of the preceding element.

The matching should cover the **entire** input string (not partial).`,
    examples: [
      {
        input: 's = "aa", p = "a"',
        output: 'false',
        explanation: '"a" does not match the entire string "aa".',
      },
      {
        input: 's = "aa", p = "a*"',
        output: 'true',
        explanation: '"*" means zero or more of the preceding element, "a". Therefore, by repeating "a" once, it becomes "aa".',
      },
      {
        input: 's = "ab", p = ".*"',
        output: 'true',
        explanation: '".*" means "zero or more (*) of any character (.)".',
      },
    ],
    constraints: [
      '1 <= s.length <= 20',
      '1 <= p.length <= 20',
      's contains only lowercase English letters.',
      'p contains only lowercase English letters, \'.\', and \'*\'.',
      'It is guaranteed for each appearance of \'*\', there will be a previous valid character to match.',
    ],
    starterCode: {
      python: `def isMatch(s: str, p: str) -> bool:
    # Your code here
    pass`,
      javascript: `function isMatch(s, p) {
    // Your code here
}`,
    },
    testCases: [
      { id: '16-1', input: 'aa\na', expectedOutput: 'false', isHidden: false },
      { id: '16-2', input: 'aa\na*', expectedOutput: 'true', isHidden: false },
      { id: '16-3', input: 'ab\n.*', expectedOutput: 'true', isHidden: false },
      { id: '16-4', input: 'aab\nc*a*b', expectedOutput: 'true', isHidden: true },
      { id: '16-5', input: 'mississippi\nmis*is*p*.', expectedOutput: 'false', isHidden: true },
    ],
    tags: ['String', 'Dynamic Programming', 'Recursion'],
    solveCount: 2150,
    successRate: 35.8,
  },
  {
    id: '17',
    title: 'Merge k Sorted Lists',
    slug: 'merge-k-sorted-lists',
    difficulty: 'hard',
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        explanation: 'The linked-lists are:\n[\n  1->4->5,\n  1->3->4,\n  2->6\n]\nmerging them into one sorted list:\n1->1->2->3->4->4->5->6',
      },
      {
        input: 'lists = []',
        output: '[]',
      },
      {
        input: 'lists = [[]]',
        output: '[]',
      },
    ],
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      '-10^4 <= lists[i][j] <= 10^4',
      'lists[i] is sorted in ascending order.',
      'The sum of lists[i].length will not exceed 10^4.',
    ],
    starterCode: {
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def mergeKLists(lists: list[ListNode]) -> ListNode:
    # Your code here
    pass`,
      javascript: `// Definition for singly-linked list.
// function ListNode(val, next) {
//     this.val = (val===undefined ? 0 : val)
//     this.next = (next===undefined ? null : next)
// }

function mergeKLists(lists) {
    // Your code here
}`,
    },
    testCases: [
      { id: '17-1', input: '[[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]', isHidden: false },
      { id: '17-2', input: '[]', expectedOutput: '[]', isHidden: false },
      { id: '17-3', input: '[[]]', expectedOutput: '[]', isHidden: false },
    ],
    tags: ['Linked List', 'Divide and Conquer', 'Heap (Priority Queue)', 'Merge Sort'],
    solveCount: 2800,
    successRate: 48.2,
  },
  {
    id: '18',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'hard',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.',
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
      },
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5',
    ],
    starterCode: {
      python: `def trap(height: list[int]) -> int:
    # Your code here
    pass`,
      javascript: `function trap(height) {
    // Your code here
}`,
    },
    testCases: [
      { id: '18-1', input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', isHidden: false },
      { id: '18-2', input: '[4,2,0,3,2,5]', expectedOutput: '9', isHidden: false },
      { id: '18-3', input: '[1,2,3,4,5]', expectedOutput: '0', isHidden: true },
    ],
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack', 'Monotonic Stack'],
    solveCount: 2450,
    successRate: 45.6,
  },
  {
    id: '19',
    title: 'N-Queens',
    slug: 'n-queens',
    difficulty: 'hard',
    description: `The **n-queens** puzzle is the problem of placing \`n\` queens on an \`n x n\` chessboard such that no two queens attack each other.

Given an integer \`n\`, return all distinct solutions to the **n-queens puzzle**. You may return the answer in **any order**.

Each solution contains a distinct board configuration of the n-queens' placement, where \`'Q'\` and \`'.'\` both indicate a queen and an empty space, respectively.`,
    examples: [
      {
        input: 'n = 4',
        output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
        explanation: 'There exist two distinct solutions to the 4-queens puzzle.',
      },
      {
        input: 'n = 1',
        output: '[["Q"]]',
      },
    ],
    constraints: [
      '1 <= n <= 9',
    ],
    starterCode: {
      python: `def solveNQueens(n: int) -> list[list[str]]:
    # Your code here
    pass`,
      javascript: `function solveNQueens(n) {
    // Your code here
}`,
    },
    testCases: [
      { id: '19-1', input: '4', expectedOutput: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', isHidden: false },
      { id: '19-2', input: '1', expectedOutput: '[["Q"]]', isHidden: false },
      { id: '19-3', input: '5', expectedOutput: '[["Q....","..Q..","....Q",".Q...","...Q."],["Q....","...Q.",".Q...","....Q","..Q.."],["..Q..","....Q",".Q...","...Q.","Q...."],["...Q.","Q....","..Q..","....Q",".Q..."],["....Q",".Q...","...Q.","Q....","..Q.."],["....Q","..Q..","Q....","...Q.",".Q..."],["..Q..","Q....","...Q.",".Q...","....Q"],[".Q...","...Q.","Q....","..Q..","....Q"],[".Q...","....Q","..Q..","Q....","...Q."],["...Q.",".Q...","....Q","..Q..","Q...."]]', isHidden: true },
    ],
    tags: ['Array', 'Backtracking'],
    solveCount: 1950,
    successRate: 38.4,
  },
  {
    id: '20',
    title: 'Longest Valid Parentheses',
    slug: 'longest-valid-parentheses',
    difficulty: 'hard',
    description: `Given a string containing just the characters \`'('\` and \`')'\`, return the length of the longest valid (well-formed) parentheses substring.`,
    examples: [
      {
        input: 's = "(()"',
        output: '2',
        explanation: 'The longest valid parentheses substring is "()".',
      },
      {
        input: 's = ")()())"',
        output: '4',
        explanation: 'The longest valid parentheses substring is "()()".',
      },
      {
        input: 's = ""',
        output: '0',
      },
    ],
    constraints: [
      '0 <= s.length <= 3 * 10^4',
      's[i] is \'(\', or \')\'.',
    ],
    starterCode: {
      python: `def longestValidParentheses(s: str) -> int:
    # Your code here
    pass`,
      javascript: `function longestValidParentheses(s) {
    // Your code here
}`,
    },
    testCases: [
      { id: '20-1', input: '(()', expectedOutput: '2', isHidden: false },
      { id: '20-2', input: ')()())', expectedOutput: '4', isHidden: false },
      { id: '20-3', input: '', expectedOutput: '0', isHidden: false },
      { id: '20-4', input: '()(())', expectedOutput: '6', isHidden: true },
    ],
    tags: ['String', 'Dynamic Programming', 'Stack'],
    solveCount: 1820,
    successRate: 36.2,
  },
];

// Helper function to get problems by difficulty
export const getProblemsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => 
  problemsDatabase.filter(p => p.difficulty === difficulty);

// Helper function to get problems by tag
export const getProblemsByTag = (tag: string) =>
  problemsDatabase.filter(p => p.tags.includes(tag));

// Helper function to get a random problem
export const getRandomProblem = (difficulty?: 'easy' | 'medium' | 'hard') => {
  const pool = difficulty ? getProblemsByDifficulty(difficulty) : problemsDatabase;
  return pool[Math.floor(Math.random() * pool.length)];
};

// Get all unique tags
export const getAllTags = () => 
  Array.from(new Set(problemsDatabase.flatMap(p => p.tags))).sort();

// Get problem by slug
export const getProblemBySlug = (slug: string) =>
  problemsDatabase.find(p => p.slug === slug);
