import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Noting',
    Svg: require('@site/static/img/PZN_Noting.png').default,
    description: (
      <>
      記錄我的學習歷程——從小小的發現、除錯筆記，到那些真正推動我成長的想法。<br />
        A space to record what I learn—small discoveries, debugging notes, and the ideas that shape my growth.
      </>
    ),
  },
    {
    title: 'Creating',
    Svg: require('@site/static/img/PZN_Creating.png').default,
    description: (
      <>
        讓學習轉化為實際產出——插件、工具、原型與各種技術實驗，都反映了我的好奇心與探索精神。<br />
        Where learning turns into output—plugins, tools, prototypes, and experiments that reflect my curiosity.
      </>
    ),
  },
  {
    title: 'Documenting',
    Svg: require('@site/static/img/PZN_Documenting.png').default,
    description: (
      <>
      以結構化方式撰寫 Unreal Engine 插件、工具與專案的技術文件，內容著重實用、清楚、易於跟著操作。<br />
        Structured documentation for my Unreal Engine plugins, tools, and projects, written to be practical and easy to follow.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={Svg} className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
