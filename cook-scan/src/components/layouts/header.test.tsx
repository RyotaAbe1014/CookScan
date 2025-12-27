import { render, screen } from '@testing-library/react';
import { Header } from './header';

describe('Header', () => {
  test('正常系：タイトルが表示される', () => {
    // Given: タイトルを持つHeaderコンポーネント
    const props = { title: 'Test Title' };

    // When: レンダリングする
    render(<Header {...props} />);

    // Then: タイトルが表示される
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('正常系：サブタイトルが表示される', () => {
    // Given: タイトルとサブタイトルを持つHeaderコンポーネント
    const props = {
      title: 'Test Title',
      subtitle: 'Test Subtitle',
    };

    // When: レンダリングする
    render(<Header {...props} />);

    // Then: サブタイトルが表示される
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  test('正常系：サブタイトルが未指定の場合は表示されない', () => {
    // Given: サブタイトルなしのHeaderコンポーネント
    const props = { title: 'Test Title' };

    // When: レンダリングする
    render(<Header {...props} />);

    // Then: サブタイトルセクションが存在しない
    const subtitle = screen.queryByText(/Test Subtitle/);
    expect(subtitle).not.toBeInTheDocument();
  });

  test('正常系：rightActionが表示される', () => {
    // Given: rightActionを含むHeaderコンポーネント
    const rightAction = <button type="button">Test Action</button>;
    const props = {
      title: 'Test Title',
      rightAction,
    };

    // When: レンダリングする
    render(<Header {...props} />);

    // Then: rightActionのボタンが表示される
    expect(screen.getByRole('button', { name: 'Test Action' })).toBeInTheDocument();
  });

  test('正常系：rightActionが未指定の場合は表示されない', () => {
    // Given: rightActionなしのHeaderコンポーネント
    const props = { title: 'Test Title' };

    // When: レンダリングする
    render(<Header {...props} />);

    // Then: ボタンが存在しない
    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  test('正常系：複数のrightAction要素が表示される', () => {
    // Given: 複数のボタンを含むrightActionを持つHeaderコンポーネント
    const rightAction = (
      <>
        <button type="button">Action 1</button>
        <button type="button">Action 2</button>
      </>
    );
    const props = {
      title: 'Test Title',
      rightAction,
    };

    // When: レンダリングする
    render(<Header {...props} />);

    // Then: 両方のボタンが表示される
    expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
  });

  test('正常系：すべてのプロップスが同時に表示される', () => {
    // Given: すべてのプロップスを持つHeaderコンポーネント
    const rightAction = <button type="button">Test Action</button>;
    const props = {
      title: 'Main Title',
      subtitle: 'Subtitle Text',
      rightAction,
    };

    // When: レンダリングする
    render(<Header {...props} />);

    // Then: すべての要素が表示される
    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle Text')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Test Action' })).toBeInTheDocument();
  });

  test('正常系：セマンティックなheader要素としてレンダリングされる', () => {
    // Given: Headerコンポーネント
    const props = { title: 'Test Title' };

    // When: レンダリングする
    const { container } = render(<Header {...props} />);

    // Then: header要素が存在する
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  test('正常系：ロゴアイコンが表示される', () => {
    // Given: Headerコンポーネント
    const props = { title: 'Test Title' };

    // When: レンダリングする
    const { container } = render(<Header {...props} />);

    // Then: SVGアイコンが存在する
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('正常系：サブタイトル付きの場合、情報アイコンも表示される', () => {
    // Given: サブタイトル付きのHeaderコンポーネント
    const props = {
      title: 'Test Title',
      subtitle: 'Test Subtitle',
    };

    // When: レンダリングする
    const { container } = render(<Header {...props} />);

    // Then: ロゴアイコン + 情報アイコン = 2つのSVGが存在する
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBe(2);
  });
});
