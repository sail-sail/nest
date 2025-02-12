import { use } from 'echarts/lib/extension.js';
export * from 'echarts/lib/export/core.js';
import { install as CanvasRenderer } from 'echarts/lib/renderer/installCanvasRenderer.js';
import { install as LineChart } from 'echarts/lib/chart/line/install.js';
import { install as BarChart } from 'echarts/lib/chart/bar/install.js';
import { install as PieChart } from 'echarts/lib/chart/pie/install.js';
import { install as GridSimpleComponent } from 'echarts/lib/component/grid/installSimple.js';
import { install as AriaComponent } from 'echarts/lib/component/aria/install.js';
import { install as DatasetComponent } from 'echarts/lib/component/dataset/install.js';
import { install as Tooltip } from 'echarts/lib/component/tooltip/install.js';

use([CanvasRenderer]);
use([LineChart, BarChart, PieChart]);
use([GridSimpleComponent, AriaComponent, DatasetComponent,Tooltip]);