export const LANGUAGE_VERSIONS = {
  javascript: '18.15.0',
  typescript: '5.0.3',
  python: '3.10.0',
  java: '15.0.2',
  csharp: '6.12.0',
  php: '8.2.3',
};

export const CODE_SNIPPETS = {
  javascript: `// JavaScript
  function greet(name) {
    return \`Hello, \${name}!\`;
  }
  
  console.log(greet('World')); // Output: Hello, World!
  `,

  typescript: `// TypeScript
  function greet(name: string): string {
    return \`Hello, \${name}!\`;
  }
  
  console.log(greet('World')); // Output: Hello, World!
  `,

  python: `# Python
  def greet(name):
      return f"Hello, {name}!"
  
  print(greet('World'))  # Output: Hello, World!
  `,

  java: `// Java
  public class Main {
      public static void main(String[] args) {
          System.out.println(greet("World"));
      }
  
      public static String greet(String name) {
          return "Hello, " + name + "!";
      }
  }
  `,

  csharp: `// C#
  using System;
  
  class Program {
      static void Main() {
          Console.WriteLine(Greet("World"));
      }
  
      static string Greet(string name) {
          return "Hello, " + name + "!";
      }
  }
  `,

  php: `// PHP
  <?php
  function greet($name) {
      return "Hello, " . $name . "!";
  }
  
  echo greet("World"); // Output: Hello, World!
  ?>
  `,
};

/*Constants for file explorer component */

export const initialFileState = [
  {
    id: 1,
    name: 'Folder 1',
    type: 'folder',
    children: [
      { id: 2, name: 'File 1-1', type: 'file' },
      { id: 3, name: 'File 1-2', type: 'file' },
    ],
  },
  {
    id: 4,
    name: 'Folder 2',
    children: [
      { id: 5, name: 'File 2-1', type: 'file' },
      {
        id: 6,
        name: 'Folder 2-1',
        type: 'folder',
        children: [{ id: 7, name: 'File 2-1-1', type: 'file' }],
      },
    ],
  },
];
