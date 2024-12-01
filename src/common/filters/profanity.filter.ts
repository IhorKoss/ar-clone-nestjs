import * as fs from 'fs';
import * as path from 'path';

export class ProfanityFilter {
  private static bannedWords: Set<string> = new Set();

  private static loadBannedWords(): void {
    if (this.bannedWords.size > 0) return;

    try {
      const filePath = path.resolve(
        process.cwd(),
        'src/common/filters/bad-words.txt',
      );
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      this.bannedWords = new Set(
        fileContent
          .split('\n')
          .map((word) => word.trim().toLowerCase())
          .filter((word) => word.length > 0),
      );
    } catch (error) {
      console.error('Error loading banned words file:', error);
    }
  }
  public static containsBannedWords(input: string): boolean {
    this.loadBannedWords();
    if (!input) return false;
    const words = input
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/);
    return words.some((word) => this.bannedWords.has(word));
  }
}
