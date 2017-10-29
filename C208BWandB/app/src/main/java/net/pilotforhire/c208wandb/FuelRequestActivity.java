package net.pilotforhire.c208wandb;

import android.app.*;
import android.os.*;
import android.webkit.*;
import android.view.*;
import android.widget.*;
import android.content.*;
import android.view.ViewGroup.LayoutParams;
import android.text.*;
import android.content.res.Resources;
//import android.support.v7.app.AppCompatActivity;

public class FuelRequestActivity extends Activity {
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.table_fuel);

		EditText fuelNeededInput = (EditText) findViewById(R.id.fuel_needed_input);
		EditText fuelOnboardLeft = (EditText) findViewById(R.id.fuel_onboard_left);
		EditText fuelOnboardRight = (EditText) findViewById(R.id.fuel_onboard_right);
		
		fuelNeededInput.addTextChangedListener(new TextWatcher() {
			boolean _ignore = false;
			
			@Override
			public void onTextChanged(CharSequence s, int start, int before, int count) {
			}

			@Override
			public void beforeTextChanged(CharSequence s, int start, int count, int after) {
					// TODO Auto-generated method stub
			}
		
			@Override
			public void afterTextChanged(Editable s) {
				if(_ignore)
					return;
				_ignore = true;
				try { 
					calculateFuel();
				} catch (NumberFormatException nfe) { //or whatever exception you get
					EditText inputFuel = (EditText) findViewById(R.id.fuel_needed_input);
					//inputFuel.setText(" ");
					resetValues();
				}				
				_ignore = false;
			}
		});

		fuelOnboardLeft.addTextChangedListener(new TextWatcher() {
			boolean _ignore = false;
				
			@Override
			public void onTextChanged(CharSequence s, int start, int before, int count) {
			}

			@Override
			public void beforeTextChanged(CharSequence s, int start, int count, int after) {
					// TODO Auto-generated method stub
			}
		
			@Override
			public void afterTextChanged(Editable s) {
				if(_ignore)
					return;
				_ignore = true;
				try { 
					calculateFuel();
				} catch (NumberFormatException nfe) { //or whatever exception you get
					EditText onboard = (EditText) findViewById(R.id.fuel_onboard_left);
					//onboard.setText(" ");
					resetValues();
				}				
				_ignore = false;
			}
		});

		fuelOnboardRight.addTextChangedListener(new TextWatcher() {
			boolean _ignore = false;
				
			@Override
			public void onTextChanged(CharSequence s, int start, int before, int count) {
			}

			@Override
			public void beforeTextChanged(CharSequence s, int start, int count, int after) {
					// TODO Auto-generated method stub
			}
		
			@Override
			public void afterTextChanged(Editable s) {
				if(_ignore)
					return;
				_ignore = true;
				try { 
					calculateFuel();
				} catch (NumberFormatException nfe) { //or whatever exception you get
					EditText onboard = (EditText) findViewById(R.id.fuel_onboard_right);
					//onboard.setText(" ");
					resetValues();
				}				
				_ignore = false;
			}
		});
	}

	public void resetValues() {
		TextView fuelUpliftLbLeftCell = (TextView) findViewById(R.id.fuel_uplift_left_lb);
		TextView fuelUpliftLbRightCell = (TextView) findViewById(R.id.fuel_uplift_right_lb);
		TextView fuelUpliftLtrLeftCell57 = (TextView) findViewById(R.id.fuel_uplift_left_ltr_57);
		TextView fuelUpliftLtrRightCell57 = (TextView) findViewById(R.id.fuel_uplift_right_ltr_57);
		TextView fuelUpliftLtrLeftCell60 = (TextView) findViewById(R.id.fuel_uplift_left_ltr_60);
		TextView fuelUpliftLtrRightCell60 = (TextView) findViewById(R.id.fuel_uplift_right_ltr_60);
		TextView totalUpliftLtrCell57 = (TextView) findViewById(R.id.total_uplift_ltr_57);
		TextView totalUpliftLtrCell60 = (TextView) findViewById(R.id.total_uplift_ltr_60);
		TextView totalUpliftLbCell = (TextView) findViewById(R.id.total_uplift_lb);

		fuelUpliftLbLeftCell.setText("0");
		fuelUpliftLbRightCell.setText("0");
		fuelUpliftLtrLeftCell57.setText("0");
		fuelUpliftLtrRightCell57.setText("0");
		fuelUpliftLtrLeftCell60.setText("0");
		fuelUpliftLtrRightCell60.setText("0");
		totalUpliftLtrCell57.setText("0");
		totalUpliftLtrCell60.setText("0");
		totalUpliftLbCell.setText("0");
	}
	
	public void calculateFuel() {
		int fuelNeeded, fuelOnboardLeft, fuelOnboardRight, fuelUpliftLeftLb, fuelUpliftRightLb;
		EditText fuelNeededLb = (EditText) findViewById(R.id.fuel_needed_input);
		EditText fuelOnbrdLeft = (EditText) findViewById(R.id.fuel_onboard_left);
		EditText fuelOnbrdRight = (EditText) findViewById(R.id.fuel_onboard_right);
		TextView fuelUpliftLbLeftCell = (TextView) findViewById(R.id.fuel_uplift_left_lb);
		TextView fuelUpliftLbRightCell = (TextView) findViewById(R.id.fuel_uplift_right_lb);
		TextView fuelUpliftLtrLeftCell57 = (TextView) findViewById(R.id.fuel_uplift_left_ltr_57);
		TextView fuelUpliftLtrRightCell57 = (TextView) findViewById(R.id.fuel_uplift_right_ltr_57);
		TextView fuelUpliftLtrLeftCell60 = (TextView) findViewById(R.id.fuel_uplift_left_ltr_60);
		TextView fuelUpliftLtrRightCell60 = (TextView) findViewById(R.id.fuel_uplift_right_ltr_60);
		TextView totalUpliftLtr57 = (TextView) findViewById(R.id.total_uplift_ltr_57);
		TextView totalUpliftLtr60 = (TextView) findViewById(R.id.total_uplift_ltr_60);
		TextView totalUpliftLb = (TextView) findViewById(R.id.total_uplift_lb);

		fuelNeeded = Integer.valueOf(fuelNeededLb.getText().toString());
		fuelOnboardLeft = Integer.valueOf(fuelOnbrdLeft.getText().toString());
		fuelOnboardRight = Integer.valueOf(fuelOnbrdRight.getText().toString());
		fuelUpliftLeftLb = (fuelNeeded/2) - fuelOnboardLeft;
		fuelUpliftRightLb = (fuelNeeded/2) - fuelOnboardRight;

		int fuelUpliftLeftLtr57 = (int) Math.round(fuelUpliftLeftLb * 0.57);
		int fuelUpliftRightLtr57 = (int) Math.round(fuelUpliftRightLb * 0.57);
		int fuelUpliftLeftLtr60 = (int) Math.round(fuelUpliftLeftLb * 0.6);
		int fuelUpliftRightLtr60 = (int) Math.round(fuelUpliftRightLb * 0.6);
		int totalUpliftLtr57calc = fuelUpliftLeftLtr57 + fuelUpliftRightLtr57;
		int totalUpliftLtr60calc = fuelUpliftLeftLtr60 + fuelUpliftRightLtr60;
		int totalUpliftLbcalc = fuelUpliftLeftLb + fuelUpliftRightLb;

		fuelUpliftLbLeftCell.setText(Integer.toString(fuelUpliftLeftLb));
		fuelUpliftLbRightCell.setText(Integer.toString(fuelUpliftRightLb));
		fuelUpliftLtrLeftCell57.setText(Double.toString(fuelUpliftLeftLtr57));
		fuelUpliftLtrRightCell57.setText(Double.toString(fuelUpliftRightLtr57));
		fuelUpliftLtrLeftCell60.setText(Double.toString(fuelUpliftLeftLtr60));
		fuelUpliftLtrRightCell60.setText(Double.toString(fuelUpliftRightLtr60));
		totalUpliftLtr57.setText(Double.toString(totalUpliftLtr57calc));
		totalUpliftLtr60.setText(Double.toString(totalUpliftLtr60calc));
		totalUpliftLb.setText(Double.toString(totalUpliftLbcalc));
	}			
	
}

