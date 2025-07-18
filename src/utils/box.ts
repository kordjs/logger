import { BorderStyle } from '../types'
import { Colors, colorize } from './colors'

/**
 * Box drawing characters
 */
const BoxChars = {
  rounded: {
    topLeft: '╭',
    topRight: '╮',
    bottomLeft: '╰',
    bottomRight: '╯',
    horizontal: '─',
    vertical: '│',
  },
  ascii: {
    topLeft: '+',
    topRight: '+',
    bottomLeft: '+',
    bottomRight: '+',
    horizontal: '-',
    vertical: '|',
  }
} as const

/**
 * BoxLogger for creating bordered terminal output
 */
export class BoxLogger {
  private borderStyle: BorderStyle
  private padding: number
  private enableColors: boolean

  constructor(borderStyle: BorderStyle = 'rounded', padding: number = 1, enableColors: boolean = true) {
    this.borderStyle = borderStyle
    this.padding = padding
    this.enableColors = enableColors
  }

  /**
   * Create a boxed message
   */
  createBox(
    content: string | string[], 
    options: { 
      title?: string, 
      color?: string, 
      centered?: boolean,
      minWidth?: number 
    } = {}
  ): string {
    const lines = Array.isArray(content) ? content : content.split('\n')
    const chars = BoxChars[this.borderStyle]
    const color = options.color || Colors.blue
    
    // Calculate dimensions
    const contentWidth = Math.max(
      ...lines.map(line => this.getDisplayWidth(line)),
      options.title ? this.getDisplayWidth(options.title) : 0,
      options.minWidth || 0
    )
    
    const boxWidth = contentWidth + (this.padding * 2)
    const result: string[] = []
    
    // Top border
    if (options.title) {
      const titleLine = this.createTitleLine(options.title, boxWidth, chars, color)
      result.push(titleLine)
    } else {
      const topLine = this.createBorderLine('top', boxWidth, chars, color)
      result.push(topLine)
    }
    
    // Content lines
    for (const line of lines) {
      const contentLine = this.createContentLine(line, boxWidth, chars, color, options.centered)
      result.push(contentLine)
    }
    
    // Bottom border
    const bottomLine = this.createBorderLine('bottom', boxWidth, chars, color)
    result.push(bottomLine)
    
    return result.join('\n')
  }

  private getDisplayWidth(text: string): number {
    // Remove ANSI escape sequences for width calculation
    return text.replace(/\x1b\[[0-9;]*m/g, '').length
  }

  private createTitleLine(title: string, boxWidth: number, chars: any, color: string): string {
    const titleWidth = this.getDisplayWidth(title)
    const availableSpace = boxWidth - titleWidth - 2 // 2 for spaces around title
    const leftPadding = Math.floor(availableSpace / 2)
    const rightPadding = availableSpace - leftPadding
    
    const leftBorder = chars.horizontal.repeat(leftPadding)
    const rightBorder = chars.horizontal.repeat(rightPadding)
    
    const line = `${chars.topLeft}${leftBorder} ${title} ${rightBorder}${chars.topRight}`
    
    return colorize(line, color, this.enableColors)
  }

  private createBorderLine(position: 'top' | 'bottom', boxWidth: number, chars: any, color: string): string {
    const leftChar = position === 'top' ? chars.topLeft : chars.bottomLeft
    const rightChar = position === 'top' ? chars.topRight : chars.bottomRight
    const line = `${leftChar}${chars.horizontal.repeat(boxWidth)}${rightChar}`
    
    return colorize(line, color, this.enableColors)
  }

  private createContentLine(content: string, boxWidth: number, chars: any, color: string, centered: boolean = false): string {
    const contentWidth = this.getDisplayWidth(content)
    const availableSpace = boxWidth - contentWidth
    
    let leftPadding: string
    let rightPadding: string
    
    if (centered) {
      const leftSpaces = Math.floor(availableSpace / 2)
      const rightSpaces = availableSpace - leftSpaces
      leftPadding = ' '.repeat(leftSpaces)
      rightPadding = ' '.repeat(rightSpaces)
    } else {
      leftPadding = ' '.repeat(this.padding)
      rightPadding = ' '.repeat(availableSpace - this.padding)
    }
    
    const leftBorder = colorize(chars.vertical, color, this.enableColors)
    const rightBorder = colorize(chars.vertical, color, this.enableColors)
    
    return `${leftBorder}${leftPadding}${content}${rightPadding}${rightBorder}`
  }
}