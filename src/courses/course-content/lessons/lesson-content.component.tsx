import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  InlineNotification,
  UnorderedList,
  OrderedList,
  ListItem,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
} from '@carbon/react';
import {
  type LocalizedText,
  type Lesson,
  type ContentBlock,
  ContentBlockType,
  type HeadingProperties,
  HeadingLevel,
  AlertKind,
  type AlertProperties,
  type MediaProperties,
  type ListProperties,
  type TableProperties,
} from '../../../types';
import { getLocalizedText } from '../../../utils/helpers';
import { AsyncContent } from '../../../components';
import styles from './lesson-content.scss';

interface LessonContentProps {
  lesson: Lesson;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  const { t, i18n } = useTranslation();

  const renderHeading = (block: ContentBlock, index: number) => {
    const properties = block.properties as HeadingProperties;
    const level = properties?.level || HeadingLevel.H2;
    const text = getLocalizedText(i18n.language, block.content);
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

    return (
      <HeadingTag key={`heading-${index}`} className={styles.contentHeading}>
        {text}
      </HeadingTag>
    );
  };

  const renderParagraph = (block: ContentBlock, index: number) => {
    const text = getLocalizedText(i18n.language, block.content);

    return (
      <p key={`paragraph-${index}`} className={styles.contentParagraph}>
        {text}
      </p>
    );
  };

  const renderList = (block: ContentBlock, index: number) => {
    const properties = block.properties as ListProperties;
    const isOrdered = properties?.ordered || false;
    const ListComponent = isOrdered ? OrderedList : UnorderedList;

    return (
      <ListComponent key={`list-${index}`} className={styles.contentList}>
        {block.items?.map((item, itemIndex) => (
          <ListItem key={`item-${itemIndex}`}>{getLocalizedText(i18n.language, item)}</ListItem>
        ))}
      </ListComponent>
    );
  };

  const renderAlert = (block: ContentBlock, index: number) => {
    const properties = block.properties as AlertProperties;
    const kind = properties?.variant || AlertKind.INFO;
    const text = getLocalizedText(i18n.language, block.content);
    const title = block.properties?.title ? getLocalizedText(i18n.language, block.properties.title) : null;

    return (
      <InlineNotification key={`alert-${index}`} kind={kind} title={title || ''} subtitle={text} hideCloseButton />
    );
  };

  const renderImage = (block: ContentBlock, index: number) => {
    const properties = block.properties as MediaProperties;
    const imageUrl = properties?.url;
    const altText = properties?.alt ? getLocalizedText(i18n.language, properties.alt) : '';
    const caption = properties?.caption ? getLocalizedText(i18n.language, properties.caption) : null;

    if (!imageUrl) return null;

    const fullImageUrl = imageUrl.startsWith('http')
      ? imageUrl
      : `${window.openmrsBase}/ws/rest/v1/obs/${imageUrl}/complex`;

    return (
      <figure key={`image-${index}`} className={styles.contentFigure}>
        <img src={fullImageUrl} alt={altText} className={styles.contentImage} />
        {caption && <figcaption className={styles.contentCaption}>{caption}</figcaption>}
      </figure>
    );
  };

  const renderVideo = (block: ContentBlock, index: number) => {
    const properties = block.properties as MediaProperties;
    const videoUrl = properties?.url;
    const caption = properties?.caption ? getLocalizedText(i18n.language, properties.caption) : null;

    if (!videoUrl) return null;

    const fullVideoUrl = videoUrl.startsWith('http')
      ? videoUrl
      : `${window.openmrsBase}/ws/rest/v1/obs/${videoUrl}/complex`;

    return (
      <figure key={`video-${index}`} className={styles.contentFigure}>
        <video controls className={styles.contentVideo}>
          <source src={fullVideoUrl} />
          {t('videoNotSupported')}
        </video>
        {caption && <figcaption className={styles.contentCaption}>{caption}</figcaption>}
      </figure>
    );
  };

  const renderTable = (block: ContentBlock, index: number) => {
    const properties = block.properties as TableProperties;
    const headers = properties?.headers?.map((header) => getLocalizedText(i18n.language, header)) || [];
    const rows = properties?.rows || [];
    const caption = properties?.caption ? getLocalizedText(i18n.language, properties.caption) : null;

    return (
      <div key={`table-${index}`}>
        <StructuredListWrapper>
          <StructuredListHead>
            <StructuredListRow head>
              {headers.map((header: string, headerIndex: number) => (
                <StructuredListCell head key={`header-${headerIndex}`}>
                  {header}
                </StructuredListCell>
              ))}
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {rows.map((row: any[], rowIndex: number) => (
              <StructuredListRow key={`row-${rowIndex}`}>
                {row.map((cell: LocalizedText, cellIndex: number) => (
                  <StructuredListCell key={`cell-${cellIndex}`}>
                    {getLocalizedText(i18n.language, cell)}
                  </StructuredListCell>
                ))}
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
        {caption && <figcaption className={styles.contentCaption}>{caption}</figcaption>}
      </div>
    );
  };

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case ContentBlockType.HEADING:
        return renderHeading(block, index);
      case ContentBlockType.PARAGRAPH:
        return renderParagraph(block, index);
      case ContentBlockType.LIST:
        return renderList(block, index);
      case ContentBlockType.ALERT:
        return renderAlert(block, index);
      case ContentBlockType.IMAGE:
        return renderImage(block, index);
      case ContentBlockType.VIDEO:
        return renderVideo(block, index);
      case ContentBlockType.TABLE:
        return renderTable(block, index);
      default:
        return (
          <p key={`unknown-${index}`} className={styles.unknownBlock}>
            {t('unknownBlockType', { type: block.type })}
          </p>
        );
    }
  };

  const contentBlocks: ContentBlock[] = lesson.content ? (lesson.content as ContentBlock[]) : [];

  return (
    <AsyncContent isEmpty={contentBlocks.length === 0} emptyMessage={t('noContentAvailable')}>
      <article className={styles.lessonContent}>
        {contentBlocks.map((block, index) => renderContentBlock(block, index))}
      </article>
    </AsyncContent>
  );
};

export default LessonContent;
